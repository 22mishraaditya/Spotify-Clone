// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== SONG DATABASE ==========
    // Define all your songs with their details
    const songs = {
        // Quick access cards (your regional hits)
        'Punjabi Hits': {
            title: 'Punjabi Hits',
            artist: 'Various Artists',
            image: 'Screenshot 2026-02-16 110823.png',
            songFile: 'songs/punjabi-hits.mp3' // You'll need actual audio files
        },
        'Haryanvi Hits': {
            title: 'Haryanvi Hits',
            artist: 'Various Artists',
            image: 'Screenshot 2026-02-16 110835.png',
            songFile: 'songs/haryanvi-hits.mp3'
        },
        'Rajasthani Hits': {
            title: 'Rajasthani Hits',
            artist: 'Various Artists',
            image: 'Screenshot 2026-02-16 110903.png',
            songFile: 'songs/rajasthani-hits.mp3'
        },
        'Hindi Hits': {
            title: 'Hindi Hits',
            artist: 'Various Artists',
            image: 'Screenshot 2026-02-16 111124.png',
            songFile: 'songs/hindi-hits.mp3'
        },
        'Bollywood Hits': {
            title: 'Bollywood Hits',
            artist: 'Various Artists',
            image: 'Screenshot 2026-02-16 111140.png',
            songFile: 'songs/bollywood-hits.mp3'
        },
        'Hollywood Hits': {
            title: 'Hollywood Hits',
            artist: 'Various Artists',
            image: 'Screenshot 2026-02-16 111159.png',
            songFile: 'songs/hollywood-hits.mp3'
        },
        
        // Artist songs
        'Arijit Singh': {
            title: 'Tum Hi Ho',
            artist: 'Arijit Singh',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Arijit_Singh_performance_at_Chandigarh_2025.jpg/640px-Arijit_Singh_performance_at_Chandigarh_2025.jpg',
            songFile: 'songs/arijit-tum-hi-ho.mp3'
        },
        'AP Dhillon': {
            title: 'Brown Munde',
            artist: 'AP Dhillon',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/AP_Dhillon_CA.jpg/640px-AP_Dhillon_CA.jpg',
            songFile: 'songs/ap-brown-munde.mp3'
        },
        'Atif Aslam': {
            title: 'Tera Hone Laga Hoon',
            artist: 'Atif Aslam',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Atif_Aslam_in_black_coat.jpg/640px-Atif_Aslam_in_black_coat.jpg',
            songFile: 'songs/atif-tera-hone-laga.mp3'
        },
        'Karan Aujla': {
            title: '52 Bars',
            artist: 'Karan Aujla',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Karan_Aujla_2020.jpg/640px-Karan_Aujla_2020.jpg',
            songFile: 'songs/karan-52-bars.mp3'
        },
        'Masoom Sharma': {
            title: 'Badnaam',
            artist: 'Masoom Sharma',
            image: 'https://pendujatt.com.se/uploads/album/badnaam-masoom-sharma.webp',
            songFile: 'songs/masoom-badnaam.mp3'
        },
        
        // Playlist songs
        "Today's Top Hits": {
            title: 'Top Hit Song',
            artist: 'Various Artists',
            image: 'Screenshot 2026-02-16 110349.png',
            songFile: 'songs/top-hits.mp3'
        },
        'Rap Caviar': {
            title: 'Rap Song',
            artist: 'KRSNA',
            image: 'https://imgs.search.brave.com/E-EKgeQrzxa_j7lF-PZZs9976wxiOf2WS63jRWotevo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci80NzYv/NjI5L0hELXdhbGxw/YXBlci1iYW50YWkt/YXZlei1raGFuLWVt/aXdheS1lbWl3YXkt/YmFudGFpLWVtaXdh/eS1tdW1iYWktcmFw/cGVyLXJlZC1yZWQt/c21hcnR5LWtoYW4t/dGh1bWJuYWlsLmpw/Zw',
            songFile: 'songs/rap-caviar.mp3'
        },
        'Chill Hits': {
            title: 'Chill Song',
            artist: 'Hardy Sandhu',
            image: 'chill.jpg',
            songFile: 'songs/chill-hits.mp3'
        },
        'Heart break Songs': {
            title: 'Sad Song',
            artist: 'Arijit Singh',
            image: 'alone.png',
            songFile: 'songs/heartbreak.mp3'
        }
    };
    
    // ========== STATE MANAGEMENT ==========
    // Track current song and recently played
    let currentSong = null;
    let recentlyPlayed = [];
    const MAX_RECENTLY_PLAYED = 6; // Show last 6 songs
    
    // Create audio element (hidden)
    const audioPlayer = document.createElement('audio');
    audioPlayer.id = 'global-audio-player';
    document.body.appendChild(audioPlayer);
    
    // Get references to player bar elements
    const nowPlayingImg = document.querySelector('.now-playing-img');
    const trackNameEl = document.querySelector('.track-name');
    const trackArtistEl = document.querySelector('.track-artist');
    const playBtn = document.querySelector('.play-btn');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const heartIcon = document.querySelector('.player-left .far.fa-heart');
    
    // Get the Recently Played section grid
    const recentlyPlayedGrid = document.getElementById('recently-played-grid');
    
    // Store the original Liked Songs card
    const originalLikedCard = recentlyPlayedGrid ? recentlyPlayedGrid.innerHTML : '';
    
    // ========== HELPER FUNCTIONS ==========
    
    // Format time from seconds to MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Update Now Playing bar
    function updateNowPlaying(songKey) {
        const song = songs[songKey];
        if (!song) return;
        
        // Update player bar
        nowPlayingImg.src = song.image;
        nowPlayingImg.alt = song.title;
        trackNameEl.textContent = song.title;
        trackArtistEl.textContent = song.artist;
        
        // Update audio source
        audioPlayer.src = song.songFile;
        
        // Store current song
        currentSong = songKey;
        
        // Auto-play (optional - browsers may block autoplay)
        audioPlayer.play().then(() => {
            playBtn.classList.remove('fa-play-circle');
            playBtn.classList.add('fa-pause-circle');
        }).catch(e => console.log('Autoplay prevented:', e));
        
        console.log(`Now playing: ${song.title} by ${song.artist}`);
    }
    
    // Add to Recently Played
    function addToRecentlyPlayed(songKey) {
        const song = songs[songKey];
        if (!song) return;
        
        // Remove if already exists (to avoid duplicates)
        recentlyPlayed = recentlyPlayed.filter(key => key !== songKey);
        
        // Add to beginning of array
        recentlyPlayed.unshift(songKey);
        
        // Limit to MAX_RECENTLY_PLAYED items
        if (recentlyPlayed.length > MAX_RECENTLY_PLAYED) {
            recentlyPlayed.pop();
        }
        
        // Update the Recently Played grid
        updateRecentlyPlayedGrid();
        
        console.log(`Added to recently played: ${song.title}`);
    }
    
    // Update the Recently Played grid display
    function updateRecentlyPlayedGrid() {
        if (!recentlyPlayedGrid) {
            console.error('Recently played grid not found!');
            return;
        }
        
        if (recentlyPlayed.length === 0) {
            // Show the original Liked Songs card if nothing played yet
            recentlyPlayedGrid.innerHTML = originalLikedCard;
            return;
        }
        
        // Build HTML for recently played songs
        let html = '';
        recentlyPlayed.forEach((songKey, index) => {
            const song = songs[songKey];
            if (song) {
                // Add a "Now Playing" indicator for the current song
                const isCurrentSong = (songKey === currentSong);
                const nowPlayingBadge = isCurrentSong ? '<span style="position: absolute; top: 5px; right: 5px; background: #1ed760; color: black; font-size: 10px; padding: 2px 5px; border-radius: 10px;">NOW</span>' : '';
                
                html += `
                    <div class="card" data-song="${songKey}" style="position: relative;">
                        ${nowPlayingBadge}
                        <img src="${song.image}" alt="${song.title}">
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                    </div>
                `;
            }
        });
        
        recentlyPlayedGrid.innerHTML = html;
        
        // Add click handlers to the new recently played cards
        addClickHandlersToCards();
    }
    
    // Handle play/pause
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play().then(() => {
                playBtn.classList.remove('fa-play-circle');
                playBtn.classList.add('fa-pause-circle');
            }).catch(e => console.log('Play failed:', e));
        } else {
            audioPlayer.pause();
            playBtn.classList.remove('fa-pause-circle');
            playBtn.classList.add('fa-play-circle');
        }
    }
    
    // Update progress bar
    function updateProgress() {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        }
    }
    
    // ========== EVENT HANDLERS FOR CARDS ==========
    
    // Function to add click handlers to all cards
    function addClickHandlersToCards() {
        // Get all cards that might contain songs
        const allCards = document.querySelectorAll('.card');
        
        allCards.forEach(card => {
            // Remove any existing click listeners to avoid duplicates
            card.removeEventListener('click', cardClickHandler);
            // Add new click listener
            card.addEventListener('click', cardClickHandler);
        });
    }
    
    // Card click handler function
    function cardClickHandler(event) {
        // Get the song/playlist name from the card
        const titleElement = this.querySelector('h3');
        if (!titleElement) return;
        
        const songKey = titleElement.textContent.trim();
        
        // Check if this song exists in our database
        if (songs[songKey]) {
            // Update now playing
            updateNowPlaying(songKey);
            
            // Add to recently played
            addToRecentlyPlayed(songKey);
            
            // Visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            console.log(`Now playing: ${songKey}`);
        } else {
            console.log(`Song not found in database: ${songKey}`);
        }
    }
    
    // ========== SETUP AUDIO PLAYER EVENT LISTENERS ==========
    
    // Time update event
    audioPlayer.addEventListener('timeupdate', updateProgress);
    
    // When song ends
    audioPlayer.addEventListener('ended', function() {
        playBtn.classList.remove('fa-pause-circle');
        playBtn.classList.add('fa-play-circle');
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        
        // Auto-play next song in recently played if available
        if (recentlyPlayed.length > 0) {
            const currentIndex = recentlyPlayed.indexOf(currentSong);
            if (currentIndex > 0) {
                // Play the previous song
                setTimeout(() => {
                    updateNowPlaying(recentlyPlayed[currentIndex - 1]);
                }, 1000);
            } else if (recentlyPlayed.length > 1) {
                // Play the next song
                setTimeout(() => {
                    updateNowPlaying(recentlyPlayed[1]);
                }, 1000);
            }
        }
    });
    
    // When metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });
    
    // ========== SETUP PLAYER BAR CONTROLS ==========
    
    // Play/Pause button
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    // Progress bar seeking
    const progressTrack = document.querySelector('.progress-track');
    if (progressTrack) {
        progressTrack.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = clickPosition * audioPlayer.duration;
        });
    }
    
    // Heart icon (like song)
    if (heartIcon) {
        heartIcon.addEventListener('click', function() {
            this.classList.toggle('fas');
            this.classList.toggle('far');
            this.style.color = this.classList.contains('fas') ? '#1ed760' : '#b3b3b3';
        });
    }
    
    // Previous button
    const prevBtn = document.querySelector('.fa-step-backward');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (recentlyPlayed.length > 1 && currentSong) {
                // Find current song index
                const currentIndex = recentlyPlayed.indexOf(currentSong);
                if (currentIndex < recentlyPlayed.length - 1) {
                    // Play the next song (older in history)
                    updateNowPlaying(recentlyPlayed[currentIndex + 1]);
                } else {
                    // Loop to the beginning
                    updateNowPlaying(recentlyPlayed[0]);
                }
            } else {
                // Just restart current song
                audioPlayer.currentTime = 0;
            }
        });
    }
    
    // Next button
    const nextBtn = document.querySelector('.fa-step-forward');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (recentlyPlayed.length > 1 && currentSong) {
                // Find current song index
                const currentIndex = recentlyPlayed.indexOf(currentSong);
                if (currentIndex > 0) {
                    // Play the previous song (newer in history)
                    updateNowPlaying(recentlyPlayed[currentIndex - 1]);
                } else {
                    // Loop to the end
                    updateNowPlaying(recentlyPlayed[recentlyPlayed.length - 1]);
                }
            }
        });
    }
    
    // Shuffle button
    const shuffleBtn = document.querySelector('.fa-random');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            this.style.color = this.style.color === 'rgb(30, 215, 96)' ? '#b3b3b3' : '#1ed760';
            
            if (recentlyPlayed.length > 1) {
                // Shuffle the recently played array
                const shuffled = [...recentlyPlayed];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                recentlyPlayed = shuffled;
                updateRecentlyPlayedGrid();
            }
        });
    }
    
    // Repeat button
    const repeatBtn = document.querySelector('.fa-redo-alt');
    if (repeatBtn) {
        repeatBtn.addEventListener('click', function() {
            this.style.color = this.style.color === 'rgb(30, 215, 96)' ? '#b3b3b3' : '#1ed760';
            audioPlayer.loop = !audioPlayer.loop;
        });
    }
    
    // Volume control
    const volumeBar = document.querySelector('.volume-bar .progress-track');
    const volumeFill = document.querySelector('.volume-bar .progress-fill');
    const volumeIcon = document.querySelector('.fa-volume-up');
    
    if (volumeBar && volumeFill && volumeIcon) {
        volumeBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            audioPlayer.volume = Math.max(0, Math.min(1, clickPosition));
            volumeFill.style.width = `${audioPlayer.volume * 100}%`;
            
            // Update volume icon
            if (audioPlayer.volume === 0) {
                volumeIcon.classList.remove('fa-volume-up');
                volumeIcon.classList.add('fa-volume-mute');
            } else {
                volumeIcon.classList.remove('fa-volume-mute');
                volumeIcon.classList.add('fa-volume-up');
            }
        });
    }
    
    // ========== SEARCH FUNCTIONALITY ==========
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Show all cards
                document.querySelectorAll('.card').forEach(card => {
                    card.style.display = 'block';
                });
                return;
            }
            
            // Filter cards based on search
            document.querySelectorAll('.card').forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const artist = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // ========== INITIALIZATION ==========
    
    // Add click handlers to all cards on page load
    addClickHandlersToCards();
    
    // Initialize recently played with the Liked Songs card
    if (recentlyPlayedGrid) {
        recentlyPlayedGrid.innerHTML = originalLikedCard;
    }
    const form = document.getElementById("loginForm");

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(email === "" || password === ""){
alert("Please enter email and password");
return;
}

const res = await fetch("http://localhost:3000/api/auth/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email:email,
password:password
})

});

const data = await res.json();

console.log(data);

if(data.token){

localStorage.setItem("token",data.token);

alert("Login Successful");

window.location.href="index.html";

}else{

alert("Login Failed");

}

});

}
    
    // Initialize volume to 60%
    audioPlayer.volume = 0.6;
    if (volumeFill) volumeFill.style.width = '60%';
    
    // Add a clear recently played button (optional)
    const seeAllLink = document.querySelector('.show-all');
    if (seeAllLink) {
        seeAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear recently played (for testing)
            if (confirm('Clear recently played history?')) {
                recentlyPlayed = [];
                updateRecentlyPlayedGrid();
            }
        });
    }
    
    console.log('Audify is ready! Click on any card to play.');
    console.log('Recently played section will update automatically.');
});
window.onload = function() {
    fetch("http://localhost:5000/api/songs")
      .then(res => res.json())
      .then(data => {
        console.log("Songs from backend:", data);
      })
      .catch(error => {
        console.log("Error fetching songs:", error);
      });
  };