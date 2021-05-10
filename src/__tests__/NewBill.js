import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import Firestore from "../app/Firestore";
import { localStorageMock } from "../__mocks__/localStorage";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import Router from "../app/Router";



describe("Given I am connected as an employee", () => {
  describe.only("When I am on NewBill Page", () => {
    test("Then ...", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const firestore = null;
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      });
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      const handleSubmit = jest.fn(newBill.handleSubmit);
      const formNewBill = screen.getByTestId('form-new-bill');
      formNewBill.addEventListener('submit', handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();

      //handleChangeFile
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputImage = screen.getByTestId('file');
      inputImage.addEventListener('change', handleChangeFile);

      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png', })
      // i have to do this because `input.files =[file]` is not allowed
      Object.defineProperty(inputEl, 'files', { value: [file] });
      fireEvent.change(inputImage);


/*       
      const file = new File(['(⌐□_□)'], 'chucknorris.jpg', { type: 'image/jpg' })
      const imageInput = screen.getByTestId('file');
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      imageInput.addEventListener('change', handleChangeFile);
      fireEvent.click(imageInput);
      expect(handleChangeFile).toHaveBeenCalled();

      userEvent.upload(imageInput, file);
      expect(handleChangeFile).toHaveBeenCalled();
      //expect(imageInput.files[0]).toStrictEqual(file);
      //expect(imageInput.files).toHaveLength(1);
      //expect(window.alert).not.toHaveBeenCalled();

      //expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy(); */
    })
  })
  // test d'intégration POST
  describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to NewBills UI", () => {
      test("create bills from mock API add", async () => {
        const addSpy = jest.spyOn(firebase, "add");
        const bills = await firebase.add();
        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(bills.data.length).toBe(2);
      });
      test("add bills from an API and fails with 404 message error", async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
        );
        const html = NewBillUI({ error: "Erreur 404" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });
      test("add messages from an API and fails with 500 message error", async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 500"))
        );
        const html = NewBillUI({ error: "Erreur 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  })
})