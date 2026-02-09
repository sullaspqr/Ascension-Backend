// Bejelentkezés/Regisztráció modal kezelése
const API_URL = 'http://localhost:3000/api/auth';

document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('auth-modal');
    const authToggle = document.getElementById('auth-toggle');
    const authClose = document.querySelector('.auth-close');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Ellenőrizzük van-e bejelentkezett felhasználó
    checkAuthStatus();

    // Modal megnyitása
    authToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Ha be van jelentkezve, kijelentkezés
            if (confirm('Biztosan ki szeretnél jelentkezni?')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                alert('Sikeresen kijelentkeztél!');
                location.reload();
            }
        } else {
            // Ha nincs bejelentkezve, modal megnyitása
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Modal bezárása
    authClose.addEventListener('click', function() {
        authModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Modal bezárása kattintásra a háttéren
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Modal bezárása ESC billentyűre
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Tab váltás
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            if (tabName === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });

    // Bejelentkezési form submit
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailOrUsername = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        console.log('🔐 Bejelentkezés indítása...');
        
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrUsername, password })
            });
            
            const data = await response.json();
            
            console.log('Válasz:', data);
            
            if (data.success) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                alert(`✅ Sikeres bejelentkezés! Üdv, ${data.user.username}! 🎉`);
                
                loginForm.reset();
                authModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                updateAuthButton();
            } else {
                alert(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('❌ Login hiba:', error);
            alert('❌ Nem lehet kapcsolódni a backend-hez!\n\nEllenőrizd:\n- Backend fut? (npm start)\n- Port 3000 szabad?\n- MySQL elindul?');
        }
    });

    // Regisztrációs form submit
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;
        
        if (password !== passwordConfirm) {
            alert('❌ A jelszavak nem egyeznek!');
            return;
        }
        
        console.log('📝 Regisztráció indítása...', { username, email });
        
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            console.log('Válasz:', data);
            
            if (data.success) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                alert(`✅ Sikeres regisztráció! Üdv, ${data.user.username}! 🎉`);
                
                registerForm.reset();
                authModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                updateAuthButton();
            } else {
                alert(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('❌ Register hiba:', error);
            alert('❌ Nem lehet kapcsolódni a backend-hez!\n\nEllenőrizd:\n- Backend fut? (npm start)\n- Port 3000 szabad?\n- MySQL elindult?');
        }
    });
    
    // Auth státusz ellenőrzése
    function checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            updateAuthButton();
        }
    }
    
    // Auth gomb frissítése
    function updateAuthButton() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            authToggle.textContent = user.username;
            authToggle.title = 'Kijelentkezés';
        }
    }
});
