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
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    fileInput.addEventListener("change", this.handleChangeFile);
    //
    this.file = null;
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    //
    new Logout({ document, localStorage, onNavigate });
  }
  /*
    handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    const email = JSON.parse(localStorage.getItem("user")).email

    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({fileUrl, key}) => {
        console.log(fileUrl)
        this.billId = key
        this.fileUrl = fileUrl
        this.fileName = fileName
      }).catch(error => console.error(error))
  }
  */

  handleChangeFile = (e) => {
    e.preventDefault();
    const inputFile = this.document.querySelector(`input[data-testid="file"]`);

    const file = inputFile.files[0];

    //If no file was added
    if (!file) {
      console.log("No file was added");
      return;
    }

    this.file = file;
    console.log(
      "%cthis.file:",
      "background: darkblue; padding: 5px;",
      this.file
    );

    //To check if the file sent is an image and the format of the image is acceptable
    let fileIsAnImageWithAcceptableFormat =
      file.type.includes("image/png") ||
      file.type.includes("image/jpg") ||
      file.type.includes("image/jpeg");

    if (fileIsAnImageWithAcceptableFormat) {
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

    this.fileName = this.file.name;
    this.fileUrl = e.currentTarget.value;

    console.log(this.fileName, "&", this.fileUrl);

    const email = JSON.parse(localStorage.getItem("user")).email;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    this.store
      .bills()
      .create({
        //Problem lies within this line
        //after we upload the image → The page refreshes itself
        //and sends the uncompleted bill with the image file to the Database
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .then(({ fileUrl, key }) => {
        console.log(fileUrl);
        this.billId = key;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
      })
      .catch((error) => console.error(error));
  };

  // handleChangeFile = (e) => {
  //   e.preventDefault();
  //   const file = this.document.querySelector(`input[data-testid="file"]`)
  //     .files[0];
  //   const filePath = e.target.value.split(/\\/g);
  //   const fileName = filePath[filePath.length - 1];
  //   const formData = new FormData();
  //   const email = JSON.parse(localStorage.getItem("user")).email;
  //   formData.append("file", file);
  //   formData.append("email", email);
  //   this.fileName = fileName;
  //   this.fileUrl = e.target.value;
  // this.store
  //   .bills()
  //   .create({
  //     //Problem lies within this line
  //     //after we upload the image → The page refreshes itself
  //     //and sends the uncompleted bill with the image file to the Database
  //     data: formData,
  //     headers: {
  //       noContentType: true,
  //     },
  //   })
  //   .then(({ fileUrl, key }) => {
  //     console.log(fileUrl);
  //     this.billId = key;
  //     this.fileUrl = fileUrl;
  //     this.fileName = fileName;
  //   })
  //   .catch((error) => console.error(error));
  // };
  /*

*/
  //
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      'e.target.querySelector(`input[data-testid="datepicker"]`).value',
      e.target.querySelector(`input[data-testid="datepicker"]`).value
    );
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.store
      .bills()
      .create({
        data: bill,
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
    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH["Bills"]);
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    console.log("this.store:\n", this.store);
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
