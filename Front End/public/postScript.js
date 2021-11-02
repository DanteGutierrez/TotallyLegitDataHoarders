const poster = document.getElementById("Poster");

const errorElement = document.getElementById("Errors");

const posterRegex = /^.+$/;

const errors = false;

const check = () => {
    let errorMessage = "";
    if (!posterRegex.test(poster.value)) {
        errors = true;
        errorMessage += "You need to tell us who is posting... <br/>";
    }
    errorElement.innerHTML = errorMessage;
};

const mySubmit = evt => {
    check();
    return !errors;
};