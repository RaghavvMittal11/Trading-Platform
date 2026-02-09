document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotForm = document.getElementById('forgotForm');

 
    const linkSignup = document.getElementById('linkSignup');
    const linkLogin = document.getElementById('linkLogin');
    const linkForgot = document.getElementById('linkForgot');
    const linkLoginFromForgot = document.getElementById('linkLoginFromForgot');

    function switchForm(hideForms, showForm) {
        
        hideForms.forEach(form => {
            form.classList.remove('active-form');
            form.classList.add('hidden-form');
        });

       
        showForm.classList.remove('hidden-form');
        showForm.classList.add('active-form');

      
    }

    if (linkSignup) {
        linkSignup.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm([loginForm, forgotForm], signupForm);
        });
    }

    if (linkLogin) {
        linkLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm([signupForm, forgotForm], loginForm);
        });
    }

    if (linkForgot) {
        linkForgot.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm([loginForm, signupForm], forgotForm);
        });
    }

    if (linkLoginFromForgot) {
        linkLoginFromForgot.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm([forgotForm, signupForm], loginForm);
        });
    }

    [loginForm, signupForm, forgotForm].forEach(form => {
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button');
                const originalText = btn.innerText;

                // Loading state
                btn.innerHTML = '<span>Processing...</span>';

                setTimeout(() => {
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }, 1000); // 1 second delay for effect
            });
        }
    });

    const viewer = document.querySelector('spline-viewer');
    if (viewer) {
        viewer.addEventListener('load-error', (e) => {
            console.error('Spline model failed to load', e);
        });
    }
});