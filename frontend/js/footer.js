// Inject Footer into HTML
function loadFooter() {
    const footerHTML = `
      <!-- Footer -->
      <footer class="bg-primary text-white py-6">
        <div class="container mx-auto px-4">
          <!-- About Us, Quick Links, Help & Support, and Follow Us Sections -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- About Us -->
            <div>
              <h4 class="text-lg font-bold mb-2">About QuickFind.LK</h4>
              <p class="text-secondary text-sm">
                QuickFind.LK is your go-to platform for finding trusted service providers across Sri Lanka. We connect you
                with verified professionals for a seamless service experience.
              </p>
            </div>
  
            <!-- Quick Links and Help & Support in Two Columns -->
            <div class="grid grid-cols-2 gap-4 col-span-2">
              <!-- Quick Links -->
              <div>
                <h4 class="text-lg font-bold mb-2">Quick Links</h4>
                <ul class="space-y-1 text-sm">
                  <li><a href="#" class="hover:text-primary-light transition duration-300">Home</a></li>
                  <li><a href="#" class="hover:text-primary-light transition duration-300">How It Works</a></li>
                  <li><a href="#" class="hover:text-primary-light transition duration-300">For Providers</a></li>
                  <li><a href="#" class="hover:text-primary-light transition duration-300">Contact Us</a></li>
                </ul>
              </div>
  
              <!-- Help & Support -->
              <div>
                <h4 class="text-lg font-bold mb-2">Help & Support</h4>
                <ul class="space-y-1 text-sm">
                  <li><a href="#" class="hover:text-primary-light transition duration-300">FAQs</a></li>
                  <li><a href="#" class="hover:text-primary-light transition duration-300">Privacy Policy</a></li>
                  <li><a href="#" class="hover:text-primary-light transition duration-300">Terms & Conditions</a></li>
                  <li><a href="#" class="hover:text-primary-light transition duration-300">Contact Us</a></li>
                </ul>
              </div>
            </div>
  
            <!-- Follow Us -->
            <div>
              <h4 class="text-lg font-bold mb-2">Follow Us</h4>
              <div class="flex space-x-2">
                <a href="#" class="hover:text-primary-light text-white">
                  <i class="fab fa-facebook text-2xl"></i>
                </a>
                <a href="#" class="hover:text-primary-light text-white">
                  <i class="fab fa-twitter text-2xl"></i>
                </a>
                <a href="#" class="hover:text-primary-light text-white">
                  <i class="fab fa-instagram text-2xl"></i>
                </a>
                <a href="#" class="hover:text-primary-light text-white">
                  <i class="fab fa-linkedin text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
  
          <!-- Footer Bottom -->
          <div class="mt-6 border-t border-white/30 pt-2 text-center text-sm">
            <p>&copy; 2024 QuickFind.LK. All rights reserved. Powered by QuickFind Team.</p>
          </div>
        </div>
      </footer>
    `;
  
    // Add the footer to the end of the body
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  }
  
  // Call the function to load the footer
  loadFooter();
  