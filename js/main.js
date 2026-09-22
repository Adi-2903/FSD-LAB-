/* ===================================================================
   Champion Sports Academy, Vadodara — Master JavaScript Application
   Production Features + Lab Practical 4 Implementations
   =================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // 1. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
            mobileToggle.innerHTML = isExpanded ? '&#215;' : '&#9776;';
        });
    }

    // 2. Animated Stats Counters
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.dataset.target || counter.innerText);
            if (isNaN(target)) return;

            let count = 0;
            const speed = target / 50;

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count) + (counter.dataset.suffix || '');
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target + (counter.dataset.suffix || '');
                }
            };
            updateCount();
        });
    }

    if (statNumbers.length > 0) {
        animateCounters();
    }

    // 3. Program Filter Tabs (Programmes Page)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    if (filterBtns.length > 0 && programCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                programCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ====================================================================
       PRACTICAL 4 - REQUIREMENT I: Geolocation API
       ==================================================================== */
    const locationBtn = document.getElementById('locationBtn');
    const locationOutput = document.getElementById('locationOutput');

    if (locationBtn && locationOutput) {
        locationBtn.addEventListener('click', function () {
            if (!navigator.geolocation) {
                locationOutput.textContent = 'Geolocation API is not supported by your browser.';
                return;
            }

            locationOutput.textContent = 'Locating nearby branch via Geolocation API...';
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude.toFixed(4);
                    const lon = position.coords.longitude.toFixed(4);
                    locationOutput.innerHTML = `📍 <strong>Coordinates:</strong> ${lat}°, ${lon}° &minus; Nearest Ground: <strong>Race Course Ground, Sayajigunj, Vadodara</strong>`;
                },
                function (error) {
                    locationOutput.innerHTML = '📍 <strong>Nearest Ground:</strong> Race Course Ground, Sayajigunj, Vadodara (Default area).';
                }
            );
        });
    }

    /* ====================================================================
       PRACTICAL 4 - REQUIREMENT II: Local Storage Inspector & Form Handler
       Iterates through localStorage.length and localStorage.key(i) to render
       all stored key-value pairs inside a live table on the web page!
       ==================================================================== */
    const admissionForm = document.getElementById('admissionForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const dumpTable = document.getElementById('localStorageDumpTable');
    const clearStorageBtn = document.getElementById('clearStorageBtn');
    const bookForm = document.getElementById('bookForm');
    const bookFormStatus = document.getElementById('bookFormStatus');

    function renderLocalStorageDump() {
        if (!dumpTable) return;
        const tbody = dumpTable.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (localStorage.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--csa-text-muted); padding: 1.5rem;">(Local Storage is currently empty. Submit the admission form above to save data!)</td></tr>`;
            return;
        }

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const val = localStorage.getItem(key);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td><strong style="color: var(--csa-navy);">${key}</strong></td>
                <td><code style="word-break: break-all; color: var(--csa-emerald); font-weight: bold;">${val}</code></td>
            `;
            tbody.appendChild(tr);
        }
    }

    // Initial render on page load
    renderLocalStorageDump();

    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', function () {
            localStorage.clear();
            renderLocalStorageDump();
        });
    }

    if (admissionForm) {
        admissionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            const fullName = document.getElementById('fullName');
            const rollNumber = document.getElementById('rollNumber');
            const firstName = document.getElementById('firstName');
            const dob = document.getElementById('dob');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const sport = document.getElementById('sportSelect');
            const batch = document.getElementById('batchSelect');
            const address = document.getElementById('address');

            [fullName, rollNumber, firstName, dob, email, phone, sport, batch, address].forEach(field => {
                if (field) field.classList.remove('is-invalid');
            });

            if (!fullName || fullName.value.trim().length < 3) {
                if (fullName) fullName.classList.add('is-invalid');
                isValid = false;
            }

            if (!rollNumber || rollNumber.value.trim() === '') {
                if (rollNumber) rollNumber.classList.add('is-invalid');
                isValid = false;
            }

            if (!firstName || firstName.value.trim() === '') {
                if (firstName) firstName.classList.add('is-invalid');
                isValid = false;
            }

            if (!dob || dob.value === '') {
                if (dob) dob.classList.add('is-invalid');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email.value.trim())) {
                if (email) email.classList.add('is-invalid');
                isValid = false;
            }

            const phoneRegex = /^[0-9]{10}$/;
            if (!phone || !phoneRegex.test(phone.value.trim())) {
                if (phone) phone.classList.add('is-invalid');
                isValid = false;
            }

            if (!sport || sport.value === '') {
                if (sport) sport.classList.add('is-invalid');
                isValid = false;
            }

            if (!batch || batch.value === '') {
                if (batch) batch.classList.add('is-invalid');
                isValid = false;
            }

            if (!address || address.value.trim().length < 5) {
                if (address) address.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                // Save to Local Storage
                const registrationData = {
                    rollNumber: rollNumber.value.trim(),
                    firstName: firstName.value.trim(),
                    name: fullName.value.trim(),
                    dateOfBirth: dob.value,
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    sport: sport.value,
                    batch: batch.value,
                    guardianName: document.getElementById('guardianName').value.trim(),
                    city: document.getElementById('city').value.trim(),
                    address: address.value.trim(),
                    registeredAt: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString()
                };

                localStorage.setItem('csa_registration_' + Date.now(), JSON.stringify(registrationData));

                const confirmName = document.getElementById('confirmName');
                const confirmSport = document.getElementById('confirmSport');

                if (confirmName) confirmName.innerText = registrationData.name;
                if (confirmSport) confirmSport.innerText = registrationData.sport;

                if (successModal) {
                    successModal.classList.add('active');
                }

                // Update live storage table
                renderLocalStorageDump();

                admissionForm.reset();
            }
        });
    }

    if (bookForm) {
        bookForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fields = {
                title: document.getElementById('bookTitle'),
                author: document.getElementById('bookAuthor'),
                publisher: document.getElementById('bookPublisher'),
                year: document.getElementById('bookYear'),
                isbn: document.getElementById('bookIsbn'),
                quantity: document.getElementById('bookQuantity')
            };

            Object.values(fields).forEach(field => field.classList.remove('is-invalid'));

            const year = Number(fields.year.value);
            const quantity = Number(fields.quantity.value);
            const isValid = fields.title.value.trim() &&
                fields.author.value.trim() &&
                fields.publisher.value.trim() &&
                year >= 1000 && year <= 2100 &&
                fields.isbn.value.trim() &&
                quantity >= 1;

            if (!isValid) {
                Object.values(fields).forEach(field => {
                    if (!field.value.trim() || (field === fields.year && (year < 1000 || year > 2100)) || (field === fields.quantity && quantity < 1)) {
                        field.classList.add('is-invalid');
                    }
                });
                bookFormStatus.textContent = 'Please complete all book details with valid values.';
                bookFormStatus.className = 'md:col-span-2 text-sm font-semibold text-red-600';
                return;
            }

            const bookData = {
                title: fields.title.value.trim(),
                author: fields.author.value.trim(),
                publisher: fields.publisher.value.trim(),
                year,
                isbn: fields.isbn.value.trim(),
                quantity,
                savedAt: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString()
            };

            localStorage.setItem('csa_book_' + Date.now(), JSON.stringify(bookData));
            bookForm.reset();
            bookFormStatus.textContent = 'Book details saved successfully.';
            bookFormStatus.className = 'md:col-span-2 text-sm font-semibold text-teal-700';
            renderLocalStorageDump();
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', function () {
            successModal.classList.remove('active');
        });
    }

    /* ====================================================================
       PRACTICAL 4 - REQUIREMENT III: Drag and Drop API
       ==================================================================== */
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    let draggedItem = null;

    if (dragItems.length > 0 && dropZones.length > 0) {
        dragItems.forEach(item => {
            item.addEventListener('dragstart', function (e) {
                draggedItem = item;
                e.dataTransfer.setData('text/plain', item.dataset.session);
                item.style.opacity = '0.5';
            });

            item.addEventListener('dragend', function () {
                draggedItem = null;
                item.style.opacity = '1';
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', function (e) {
                e.preventDefault();
                zone.classList.add('active');
            });

            zone.addEventListener('dragleave', function () {
                zone.classList.remove('active');
            });

            zone.addEventListener('drop', function (e) {
                e.preventDefault();
                zone.classList.remove('active');

                if (draggedItem) {
                    const sessionText = draggedItem.dataset.session;
                    const emptyText = zone.querySelector('.empty-text');
                    if (emptyText) emptyText.style.display = 'none';

                    const chip = document.createElement('div');
                    chip.className = 'session-chip';
                    chip.textContent = sessionText;
                    zone.appendChild(chip);
                }
            });
        });
    }
});
