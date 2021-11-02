const submit = document.getElementById("Submit");
const errorElement = document.getElementById("Errors");

const username = document.getElementById("Username");
const bio = document.getElementById("Bio");
const fname = document.getElementById("fName");
const lname = document.getElementById("lName");
const dob = document.getElementById("DOB");
const email = document.getElementById("Email");
const phone = document.getElementById("Phone");
const city = document.getElementById("City");
const state = document.getElementById("State");
const country = document.getElementById("Country");

const nameRegex = /^.+$/;
const bioRegex = /^.{0,256}$/;
const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
const emailRegex = /^.+@.{2,}\..{2,}$/;
const numberRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const stateRegex = /^[A][LKRSZ]|[C][AOT]|[D][CE]|[F][LM]|[G][AU]|[H][I]|[I][ADLN]|[K][SY]|[L][A]|[M][ADEHINOPST]|[N][CDEHJMVY]|[O][HKR]|[P][ARW]|[R][I]|[S][CD]|[T][NX]|[U][T]|[V][AIT]|[W][AIVY]$/i;

let errors = false;

const check = () => {
    errors = false;
    let errorMessage = "";
    if (!nameRegex.test(username.value)) {
        errors = true;
        errorMessage += "You need a username <br/>";
    }
    if (!bioRegex.test(bio.value)) {
        errors = true;
        errorMessage += "You need a bio of less than 256 characters <br/>";
    }
    if (!nameRegex.test(fname.value)) {
        errors = true;
        errorMessage += "You need a first name <br/>";
    }
    if (!nameRegex.test(lname.value)) {
        errors = true;
        errorMessage += "You need a last name <br/>";
    }
    if (!dobRegex.test(dob.value)) {
        errors = true;
        errorMessage += "Your birthday must be in YYYY-MM-DD <br/>";
    }
    if (!emailRegex.test(email.value)) {
        errors = true;
        errorMessage += "Your email must meet the minimum of 'a@bc.de' <br/>";
    }
    if (!numberRegex.test(phone.value)) {
        errors = true;
        errorMessage += "Your phone numbers must be in '(123) 123-1234' <br/>";
    }
    if (!stateRegex.test(state.value)) {
        error = true;
        errorMessage += "You need to have a valid state <br/>";
    }
    errorElement.innerHTML = errorMessage;
}

const mySubmit = evt => {
    check();
    return !errors;
}