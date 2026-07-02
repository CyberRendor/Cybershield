// js/auth.js
import { supabase } from './supabase.js';

// Megvárjuk, míg a gombok elérhetővé válnak az oldalon
setTimeout(() => {
    const loginBtn = document.getElementById('btn-login');
    const registerBtn = document.getElementById('btn-register');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const errorEl = document.getElementById('auth-error');
    const successEl = document.getElementById('auth-success');

    if (loginBtn && registerBtn) {
        console.log("CyberShield Auth Rendszer aktív.");

        // --- REGISZTRÁCIÓ LOGIKA ---
        registerBtn.addEventListener('click', async () => {
            errorEl.classList.add('hidden');
            successEl.classList.add('hidden');

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                showError("Kérlek, add meg az e-mail címet és a jelszót!");
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                showError("Regisztrációs hiba: " + error.message);
                return;
            }

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { 
                            id: data.user.id, 
                            email: data.user.email,
                            role: 'user', 
                            xp: 0
                        }
                    ]);
                
                if (profileError) {
                    showError("Hiba a profil mentésekor: " + profileError.message);
                    return;
                }

                showSuccess("Sikeres regisztráció! Most már rányomhatsz a Bejelentkezés gombra.");
            }
        });

        // --- BEJELENTKEZÉS LOGIKA ---
        loginBtn.addEventListener('click', async () => {
            errorEl.classList.add('hidden');
            successEl.classList.add('hidden');

            const email = emailInput.value;
            const password = passwordInput.value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                showError("Hibás e-mail vagy jelszó!");
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                showError("Nem található profil ehhez a fiókhoz!");
                return;
            }

            if (window.Progress) {
                window.Progress.setUser({
                    name: profile.full_name || email.split('@')[0], 
                    rank: profile.rank || 'Nincs',
                    unit: profile.unit || 'Központ',
                    role: profile.role,
                    xp: profile.xp || 0
                });
                window.Progress.updateHeaderUI();
            }

            if (profile.role === 'admin') {
                Navigation.showScreen('screen-teacher');
            } else {
                Navigation.showScreen('screen-map');
            }
        });
    }

    function showError(msg) {
        if(!errorEl) return;
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
    }

    function showSuccess(msg) {
        if(!successEl) return;
        successEl.textContent = msg;
        successEl.classList.remove('hidden');
    }
}, 500);
