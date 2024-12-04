// Initialize sections object after DOM content has fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    const sections = {};

    const container = document.querySelector('#popular-categories .grid');
    sections.popularCategoriesSection = document.getElementById('popular-categories');
    sections.featuredProvidersSection = document.getElementById('featured-providers');
    sections.whyChooseSection = document.getElementById('WhyChoose');
    sections.relatedCardsContainer = document.querySelector('#category-search');
    sections.providersContainer = document.querySelector('#category-card');
    sections.paginationContainer = document.getElementById('paginationC');

    try {
        const response = await fetch('http://localhost:3000/api/categories');
        const categories = await response.json();

        if (categories.length > 0) {
            // Populate the categories
            container.innerHTML = categories.map(category => `
                <div class="text-center group category-item" data-category-id="${category.id}" data-category-name="${category.name}">
                    <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2 mx-auto shadow-md group-hover:shadow-lg transition duration-300">
                        <img src="/icons/${category.name}.png" alt="${category.name}" class="w-16 object-contain" />
                    </div>
                    <p class="text-text-secondary group-hover:text-primary transition duration-300">${category.name}</p>
                </div>
            `).join('');

            // Add click event listener to each category item after they're in the DOM
            document.querySelectorAll('.category-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const categoryId = e.currentTarget.getAttribute('data-category-id');
                    const categoryName = e.currentTarget.getAttribute('data-category-name');

                    // Redirect to the search result page with category as a query parameter
                    window.location.href = `./searchResult.html?category=${encodeURIComponent(categoryName)}&categoryId=${encodeURIComponent(categoryId)}`;
                });
            });
        } else {
            container.innerHTML = '<p class="text-text-secondary">No categories found.</p>';
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        container.innerHTML = '<p class="text-text-secondary">Failed to load categories.</p>';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');
    const categoryName = urlParams.get('category');

    if (categoryId) {
        try {
            // Display category name on the page
            const resultsHeader = document.querySelector('h2');
            if (categoryName) {
                resultsHeader.textContent = `Search Results for ${categoryName}`;
            }

            // Fetch services for the given category ID
            const response = await fetch(`http://localhost:3000/api/categories/${categoryId}/services`);
            const services = await response.json();

            if (Array.isArray(services) && services.length > 0) {
                // Populate services in the searchResults container
                const searchResultsContainer = document.getElementById('searchResults');
                searchResultsContainer.innerHTML = services.map(service => `
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col lg:flex-row">
                    <!-- Image section -->
                    <img src="../../../backend/${service.images}" alt="${service.title}" class="w-full h-48 lg:w-48 lg:h-48 object-cover rounded-t-lg lg:rounded-lg mb-4 lg:mb-0 lg:mr-6">
                    
                    <!-- Content section -->
                    <div class="flex flex-col justify-between flex-1">
                        <div>
                            <h4 class="font-bold text-primary mb-2">${service.title}</h4>
                            <div class="text-yellow-400 mb-2">
                                ${'★'.repeat(Math.floor(service.rating))}${'☆'.repeat(5 - Math.floor(service.rating))}
                                <span class="text-text-secondary">(${service.reviews} reviews)</span>
                            </div>
                            <p class="text-text-secondary mb-2">
                                <i class="fas fa-map-marker-alt mr-2"></i>${service.location}
                            </p>
                            <p class="text-sm text-text-secondary mb-4">${service.description}</p>
                            <p class="text-primary font-semibold mb-4">Price: ${service.price} LKR</p>
                        </div>
                        
                        <!-- Buttons section -->
                        <div class="flex lg:flex-row justify-between items-center mt-4 lg:mt-0">
<a href="./viewProfile.html?serviceId=${encodeURIComponent(service.id)}" class="text-primary hover:text-primary-light transition duration-300 mb-2 lg:mb-0 lg:mr-4">View Profile</a>
                            <button class="bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition duration-300" onclick="addFavourite('${service.id}')">Add to Favourite</button>
                        </div>
                    </div>
                </div>




            `).join('');
            } else {
                document.getElementById('searchResults').innerHTML = '<p class="text-text-secondary">No services found for this category.</p>';
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            document.getElementById('searchResults').innerHTML = '<p class="text-text-secondary">Failed to load services.</p>';
        }
    } else {
        document.getElementById('searchResults').innerHTML = '<p class="text-text-secondary">Invalid category.</p>';
    }
});

// async function addFavourite(serviceId) {
//     var userData = localStorage.getItem('user');
//     var userDeatails = JSON.parse(userData);
//     let userId = userDeatails.id; // user id

//     if (!userId) {
//          // alert('Please log in to add a favorite');
//          Swal.fire({
//             title: "Login failed!",
//             text: "Please log in to add a favorite",
//             icon: "warning"
//           });
//         return;
//     }

//     try {
//         const response = await fetch('http://localhost:3000/api/favourite/add', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ userId, serviceId })
//         });

//         if (!response.ok) {
//             const responseData = await response.json();
//             console.error('Error response:', responseData);
//             throw new Error(responseData.message || 'Failed to add favourite');
//         }

//         const newFavourite = await response.json();
//         console.log('Added favourite:', newFavourite);
//         // alert("Successfully Added to Favourites!");
//         Swal.fire({
//             title: "Successfully Added to Favourites!",
//             // text: data.message,
//             icon: "success"
//           });


//     } catch (error) {
//         console.error('Failed to add favourite:', error);
//         // alert("Failed to add favourite")
//         Swal.fire({
//             title: "Failed to add favourite",
//             // text: data.message,
//             icon: "warning"
//           });
//     }
// }
