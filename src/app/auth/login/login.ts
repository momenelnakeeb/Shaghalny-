import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  successMessage = '';
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    this.checkForMessages();
  }

  // Create the reactive form
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Check for success messages from signup or other routes
  checkForMessages() {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.successMessage = params['message'];
        // Auto-fill email if provided
        if (params['email']) {
          this.loginForm.patchValue({ email: params['email'] });
        }
        // Clear message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
    });
  }

  // Toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Fill demo user credentials
  fillDemoUser() {
    this.loginForm.patchValue({
      email: 'jobseeker@demo.com',
      password: 'Demo123!'
    });
    this.animateFormFill();
  }

  // Fill demo recruiter credentials
  fillDemoRecruiter() {
    this.loginForm.patchValue({
      email: 'test@test.com',
      password: 'test123'
    });
    this.animateFormFill();
  }

  // Animate form fill
  animateFormFill() {
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach((input: any, index) => {
      setTimeout(() => {
        input.classList.add('demo-fill');
        setTimeout(() => input.classList.remove('demo-fill'), 600);
      }, index * 100);
    });
  }

  // Handle form submission
  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      
      try {
        // Simulate API call
        const loginData = this.loginForm.value;
        await this.authenticateUser(loginData);
        
        // Success - redirect to home
        console.log('Login successful!', loginData);
        
        // Store user data in localStorage (in a real app, use a service)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', loginData.email);
        localStorage.setItem('rememberMe', loginData.rememberMe);
        
        // Show success animation briefly then redirect
        this.showSuccessAnimation();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
        
      } catch (error) {
        console.error('Login failed:', error);
        this.loginError = 'Invalid email or password. Please try again.';
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  // Simulate user authentication
  private async authenticateUser(credentials: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo authentication logic
        const validCredentials = [
          { email: 'jobseeker@demo.com', password: 'Demo123!' },
          { email: 'recruiter@demo.com', password: 'Demo123!' },
          { email: 'admin@shaghalny.com', password: 'Admin123!' }
        ];
        
        const isValid = validCredentials.some(cred => 
          cred.email === credentials.email && cred.password === credentials.password
        );
        
        if (isValid) {
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1500); // Simulate network delay
    });
  }

  // Show success animation
  showSuccessAnimation() {
    const card = document.querySelector('.login-card');
    card?.classList.add('success-shake');
    setTimeout(() => {
      card?.classList.remove('success-shake');
    }, 600);
  }

  // Social login methods
  loginWithGoogle() {
    console.log('Google login clicked');
    // Implement Google OAuth here
    this.showSocialLoginMessage('Google');
  }

  loginWithFacebook() {
    console.log('Facebook login clicked');
    // Implement Facebook OAuth here
    this.showSocialLoginMessage('Facebook');
  }

  // Show social login message (demo)
  showSocialLoginMessage(provider: string) {
    this.successMessage = `${provider} login coming soon!`;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  // Mark all form fields as touched
  private markAllFieldsAsTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Easy access to form controls
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }
}