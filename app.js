
document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const expensePage = document.getElementById('expense-page');
    const successMessage = document.getElementById('successMessage'); // New line added

    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    const logoutButton = document.getElementById('logout');
    
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');

    let expenses = [];
    let userId = null;

    loginButton.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        loginPage.classList.remove('hidden');
    });

    signupButton.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        signupPage.classList.remove('hidden');
    });

    goToSignup.addEventListener('click', () => {
        loginPage.classList.add('hidden');
        signupPage.classList.remove('hidden');
    });

    goToLogin.addEventListener('click', () => {
        signupPage.classList.add('hidden');
        loginPage.classList.remove('hidden');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            userId = data.userId;
            loginPage.classList.add('hidden');
            expensePage.classList.remove('hidden'); // Show the expenses page
            loadExpenses();
        } else {
            alert('Invalid login');
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            signupPage.classList.add('hidden');
            loginPage.classList.remove('hidden');
        } else {
            alert('Signup failed: ' + data.message);
        }
    });

    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = document.getElementById('expense-description').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);

        const response = await fetch('/add-expense', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, description, amount })
        });

        const data = await response.json();
        if (data.success) {
            addExpense(description, amount);
            showSuccessMessage(); // Show success message after adding expense
        } else {
            alert('Failed to add expense');
        }
    });

    logoutButton.addEventListener('click', () => {
        userId = null;
        expenses = [];
        expensePage.classList.add('hidden');
        landingPage.classList.remove('hidden');
    });

    function addExpense(description, amount) {
        const expense = { description, amount };
        expenses.push(expense);
        displayExpenses();
        calculateTotal();
    }

    function displayExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                const response = await fetch('/delete-expense', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: expense.id })
                });

                const data = await response.json();
                if (data.success) {
                    deleteExpense(index);
                } else {
                    alert('Failed to delete expense');
                }
            });
            li.appendChild(deleteButton);
            expenseList.appendChild(li);
        });
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        displayExpenses();
        calculateTotal();
    }

    function calculateTotal() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    async function loadExpenses() {
        const response = await fetch(`/expenses?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
            expenses = data.expenses;
            displayExpenses();
            calculateTotal();
        } else {
            alert('Failed to load expenses');
        }
    }

    function showSuccessMessage() {
        successMessage.classList.remove('hidden');
    }

    // Event listener for "Proceed to Login" button in success message
    document.getElementById('proceedToLoginBtn').addEventListener('click', () => {
        // Redirect or handle login process here
        console.log('Redirecting to login...');
    });

});

document.addEventListener('DOMContentLoaded', () => {
    

    const scrollButton = document.querySelector('.btn.btn-primary');
    scrollButton.addEventListener('click', () => {
        document.getElementById('login-page').scrollIntoView({
            behavior: 'smooth'
        });
    });

    
});
// document.getElementById('proceedToLoginBtn').addEventListener('click', () => {
//         console.log('Redirecting to login...');
//     });

//     const scrollButton = document.querySelector('.btn.btn-primary');
//     scrollButton.addEventListener('click', () => {
//         document.getElementById('login-page').scrollIntoView({
//             behavior: 'smooth'
//         });
//     });
// });


