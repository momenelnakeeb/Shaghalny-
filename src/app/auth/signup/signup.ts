import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  
  // Password strength properties
  passwordStrength = 0;
  passwordStrengthText = '';
  passwordStrengthClass = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.watchPasswordStrength();
  }

  // Create the reactive form
  createForm() {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-\(\)]{10,}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', Validators.required],
      userType: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Watch for password changes and update strength
  watchPasswordStrength() {
    this.password?.valueChanges.subscribe(password => {
      if (password) {
        this.calculatePasswordStrength(password);
      } else {
        this.resetPasswordStrength();
      }
    });
  }

  // Calculate password strength
  calculatePasswordStrength(password: string) {
    let strength = 0;
    
    // Length points
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    
    // Character type points
    if (/[a-z]/.test(password)) strength += 20; // lowercase
    if (/[A-Z]/.test(password)) strength += 20; // uppercase  
    if (/\d/.test(password)) strength += 20; // numbers
    
    this.passwordStrength = Math.min(strength, 100);
    
    // Set strength text and class
    if (this.passwordStrength < 50) {
      this.passwordStrengthText = 'Weak';
      this.passwordStrengthClass = 'weak';
    } else if (this.passwordStrength < 80) {
      this.passwordStrengthText = 'Medium';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthText = 'Strong';
      this.passwordStrengthClass = 'strong';
    }
  }

  // Reset password strength
  resetPasswordStrength() {
    this.passwordStrength = 0;
    this.passwordStrengthText = '';
    this.passwordStrengthClass = '';
  }

  // Toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Toggle confirm password visibility
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Select user type
  selectUserType(type: 'candidate' | 'recruiter') {
    this.signupForm.patchValue({ userType: type });
  }

  // Handle form submission
  async onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      
      try {
        // Simulate API call (replace with your actual service)
        await this.delay(2000);
        
        console.log('Form Data:', this.signupForm.value);
        
        // Redirect to login with success message
        this.router.navigate(['/login'], {
          queryParams: {
            message: 'Account created successfully! Please sign in.',
            email: this.signupForm.value.email
          }
        });
        
      } catch (error) {
        console.error('Signup failed:', error);
        // Handle error here (show error message to user)
        alert('Signup failed. Please try again.');
      } finally {
        this.isLoading = false;
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markAllFieldsAsTouched();
    }
  }

  // Utility method to simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mark all form fields as touched
  private markAllFieldsAsTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  // Easy access to form controls (getters)
  get fullName() { return this.signupForm.get('fullName'); }
  get email() { return this.signupForm.get('email'); }
  get phone() { return this.signupForm.get('phone'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get userType() { return this.signupForm.get('userType'); }
  get acceptTerms() { return this.signupForm.get('acceptTerms'); }
}