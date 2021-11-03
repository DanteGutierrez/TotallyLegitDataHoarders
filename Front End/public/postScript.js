const poster = document.getElementById("Poster");
const desc = document.getElementById("Desc");

const errorElement = document.getElementById("Errors");

const posterRegex = /^.+$/;
const descRegex = /^.{500}$/;

const errors = false;

const check = () => {
    let errorMessage = "";
    if (!posterRegex.test(poster.value)) {
        errors = true;
        errorMessage += "You need to tell us who is posting... <br/>";
    }
    if (!descRegex.test(desc.value)) {
        errors = true;
        errorMessage += "You can have at most 500 characters in a post </br>";
    }
    errorElement.innerHTML = errorMessage;
};

const mySubmit = evt => {
    check();
    return !errors;
};