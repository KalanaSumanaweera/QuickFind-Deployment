// phoneVerification.js
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from './firebaseConfig.js';

class PhoneVerification {
    constructor() {
        this.recaptchaVerifier = null;
        this.confirmationResult = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupRecaptcha();
            
            const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
            const verifyCodeBtn = document.getElementById('verifyCodeBtn');

            if (verifyPhoneBtn) {
                verifyPhoneBtn.addEventListener('click', () => this.sendVerificationCode());
            }

            if (verifyCodeBtn) {
                verifyCodeBtn.addEventListener('click', () => this.verifyCode());
            }
        });
    }

    setupRecaptcha() {
        try {
            const recaptchaContainer = document.getElementById('recaptcha-container');
            
            if (!recaptchaContainer) {
                console.error('Recaptcha container is missing');
                return;
            }

            this.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        console.log('Recaptcha solved successfully', response);
                    },
                    'error-callback': (error) => {
                        console.error('Recaptcha verification failed:', error);
                        this.showErrorMessage('Recaptcha verification failed');
                    },
                }
            );

            this.recaptchaVerifier.render()
                .then((widgetId) => {
                    console.log('Recaptcha rendered with widget ID:', widgetId);
                })
                .catch((error) => {
                    console.error('Recaptcha render error:', error);
                    this.showErrorMessage('Failed to initialize verification');
                });
        } catch (error) {
            console.error('Recaptcha initialization error:', error);
            this.showErrorMessage('Verification setup failed');
        }
    }

    async sendVerificationCode() {
        try {
            const phoneInput = document.getElementById('contactNumber');
            const phoneNumber = phoneInput.value.trim();

            if (!phoneNumber) {
                this.showErrorMessage('Please enter a valid phone number');
                return;
            }

            // Ensure the phone number is in E.164 format
            const formattedPhoneNumber = phoneNumber.startsWith('+') 
                ? phoneNumber 
                : `+94${phoneNumber.replace(/\D/g, '')}`;

            console.log('Attempting to send verification code to:', formattedPhoneNumber);

            if (!this.recaptchaVerifier) {
                console.warn('Recaptcha not initialized, attempting to reinitialize');
                this.setupRecaptcha();
                return;
            }

            this.confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, this.recaptchaVerifier);

            if (this.confirmationResult) {
                console.log('Verification code sent, confirmationResult:', this.confirmationResult);
                this.showSuccessMessage('Verification code sent!');
                this.toggleVerificationUI(true);
            } else {
                throw new Error('Failed to send verification code');
            }
        } catch (error) {
            console.error('Verification error details:', error);
            this.showErrorMessage('Failed to send verification code: ' + error.message);
        }
    }

    async verifyCode() {
        try {
            const codeInput = document.getElementById('verificationCode');
            const code = codeInput.value.trim();
    
            if (!code) {
                this.showErrorMessage('Please enter the verification code');
                return;
            }
    
            if (!this.confirmationResult) {
                this.showErrorMessage('Please send verification code first');
                return;
            }
    
            console.log('Verifying code:', code);
    
            const result = await this.confirmationResult.confirm(code);
    
            if (result) {
                console.log('Verification result:', result);
                this.showSuccessMessage('Phone number verified successfully!');
                this.toggleVerificationUI(false);
    
                // Dispatch custom event
                const event = new CustomEvent('phoneVerified', {
                    detail: { success: true, phoneNumber: result.user.phoneNumber },
                });
                document.dispatchEvent(event);
            } else {
                throw new Error('Verification failed');
            }
        } catch (error) {
            console.error('Code verification error:', error);
            this.showErrorMessage('Invalid verification code: ' + error.message);
    
            // Dispatch failure event
            const event = new CustomEvent('phoneVerified', {
                detail: { success: false, error: error.message },
            });
            document.dispatchEvent(event);
        }
    }
    

    showSuccessMessage(message) {
        const messageElement = document.getElementById('verificationMessage');
        if (messageElement) {
            messageElement.innerText = message;
            messageElement.className = 'text-green-500';
            messageElement.classList.remove('hidden');
        }
    }

    showErrorMessage(message) {
        const messageElement = document.getElementById('verificationMessage');
        if (messageElement) {
            messageElement.innerText = message;
            messageElement.className = 'text-red-500';
            messageElement.classList.remove('hidden');
        }
    }

    toggleVerificationUI(showCodeInput) {
        const codeInputContainer = document.getElementById('codeInput');
        if (codeInputContainer) {
            if (showCodeInput) {
                codeInputContainer.classList.remove('hidden');
            } else {
                codeInputContainer.classList.add('hidden');
            }
        }
    }
}

// Initialize the phone verification
new PhoneVerification();
