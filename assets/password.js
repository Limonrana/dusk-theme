const Password = {
    property: {
        active: '',
        button: document.querySelector('[data-ws-modal="modal"]'),
        closeButton: document.querySelector('[data-dismiss="modal"]')
    },

    onClickOpen(event) {
        const getModalId = Password.property.button.getAttribute('data-ws-target');
        const modal = document.querySelector(getModalId);
        if (!modal.classList.contains('show')) {
            modal.classList.add('show');
            modal.style.display = 'block';
            Password.property.active = modal;
            Password.property.closeButton.addEventListener('click', Password.onClickClose);
        }
    },

    onClickClose(event) {
        const modal = Password.property.active;
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            Password.property.active = '';
        }
    },

    int() {
        Password.property.button.addEventListener('click', Password.onClickOpen);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    Password.int();
});