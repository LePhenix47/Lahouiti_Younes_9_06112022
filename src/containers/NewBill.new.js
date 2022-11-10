import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);

    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
  }
  handleChangeFile = (e) => {
    e.preventDefault();

    const inputFile = this.document.querySelector(`input[data-testid="file"]`);

    // inputFile.createAttribute("accept");
    inputFile.setAttribute("accept", "image/*,.png,.jpg,.jpeg");

    const file = inputFile.files[0];

    if (!file) {
      console.log("No file was added");
      return;
    }

    let fileIsAnImageWithAcceptableFormat =
      file.type.includes("image/png") ||
      file.type.includes("image/jpg") ||
      file.type.includes("image/jpeg");
    if (file && fileIsAnImageWithAcceptableFormat) {
      console.log(
        "%cFile type is an image with an acceptable format",
        "font-size:20px; padding: 5px; background: green"
      );
    } else {
      console.log(
        "%cFile type is NOT an image",
        "font-size:20px; padding: 5px; background: crimson"
      );
      inputFile.value = "";
      return;
    }
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];

    this.fileName = fileName;
    this.fileUrl = e.target.value;

    const formData = new FormData();
    formData.append("fileUrl", this.fileUrl);
    formData.append("fileName", this.fileName);

    //There are errors after line 58 (if we're in line 48) since we append the form data and send just: email and file
    //WITHOUT any other info about the form itself such as the
    console.log(this.fileUrl, this.fileName);

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: false,
        },
      })
      .then(({ fileUrl, key }) => {
        console.log({ fileUrl, key });
        this.billId = key;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        e.preventDefault();
      })
      .catch((error) => console.error(error));
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const userInfos = JSON.parse(localStorage.getItem("user"));
    const valueOfEmail = userInfos.email;

    const valueOfType = e.target.querySelector(
      `select[data-testid="expense-type"]`
    ).value;
    const valueOfName = e.target.querySelector(
      `input[data-testid="expense-name"]`
    ).value;
    const valueOfAmount = e.target.querySelector(
      `input[data-testid="amount"]`
    ).valueAsNumber;
    const valueOfDate = e.target.querySelector(
      `input[data-testid="datepicker"]`
    ).valueAsDate;
    const valueOfPercentage =
      e.target.querySelector(`input[data-testid="pct"]`).valueAsNumber || 20;
    const valueOfVAT = e.target.querySelector(
      `input[data-testid="vat"]`
    ).valueAsNumber;
    const valueOfCommentary = e.target.querySelector(
      `textarea[data-testid="commentary"]`
    ).value;

    /* 
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }
*/

    let bill = [];
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
      bill.push([pair[0], pair[1]]);
    }

    bill = Object.fromEntries(bill);
    console.log(bill);

    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH["Bills"]);
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
