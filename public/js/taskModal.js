const openBtn = document.querySelector('.open-modal-btn');
        const modal = document.querySelector('.modal-overlay');
        const closeBtn = document.querySelector('.close-btn');
        const cancelBtn = document.querySelector('.cancel-btn');
        
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        const calendarBtn = document.querySelector('.calendar-btn');
        const dueDateInput = document.getElementById('dueDate');

        calendarBtn.addEventListener('click', () => {
            dueDateInput.showPicker();
        });