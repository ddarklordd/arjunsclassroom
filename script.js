document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

    // Background animation with math symbols
    const animationContainer = document.getElementById('background-animation');
    if (animationContainer) {
        const symbols = ['&int;', '&sum;', '&part;', '&radic;', '&infin;', '&pi;', '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', 'E=mc²', 'F=ma'];
        const createSymbol = () => {
            const symbol = document.createElement('div');
            symbol.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
            symbol.style.position = 'absolute';
            symbol.style.fontSize = `${Math.random() * 2 + 1}rem`;
            symbol.style.color = 'rgba(255, 255, 255, 0.5)';
            symbol.style.top = `${Math.random() * 100}%`;
            symbol.style.left = `${Math.random() * 100}%`;
            symbol.style.animation = `fly ${Math.random() * 10 + 10}s linear infinite`;
            animationContainer.appendChild(symbol);
        };

        for (let i = 0; i < 30; i++) {
            createSymbol();
        }

        const keyframes = `
        @keyframes fly {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}vw, ${Math.random() * 100 - 50}vh);
            }
        }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = keyframes;
        document.head.appendChild(styleSheet);
    }


    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Contact form submission
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.elements['name'].value;
        const email = this.elements['email'].value;
        const subject = this.elements['subject'].value;
        const message = this.elements['message'].value;

        const formData = { name, email, subject, message };

        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            this.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later.');
        });
    });

    // Star rating
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('rating-value');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingValue.value = value;
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= value) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });

    // Review form submission
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const studentName = this.elements['student-name'].value;
        const rating = parseInt(ratingValue.value);
        const reviewText = this.elements['review-text'].value;

        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }

        const review = {
            studentName,
            rating,
            reviewText
        };

        saveReview(review);
        displayReviews();
        this.reset();
        stars.forEach(s => s.classList.remove('selected'));
        ratingValue.value = 0;
    });

    // Load and display reviews on page load
    displayReviews();

    // Animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.service-package, .boards, .cta-button, .review, #review-form, #contact-form, .about-container').forEach(el => {
        observer.observe(el);
    });
});

function saveReview(review) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function getReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || [];
}

function displayReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '';
    const reviews = getReviews();
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
            <div class="rating">${'&#9733;'.repeat(review.rating)}${'&#9734;'.repeat(5 - review.rating)}</div>
            <p>"${review.reviewText}"</p>
            <p class="student-name">- ${review.studentName}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });
}
