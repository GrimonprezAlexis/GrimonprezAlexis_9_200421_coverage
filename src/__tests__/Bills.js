import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"
import firebase from "../__mocks__/firebase"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test('Then, Loading page should be rendered', () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
    test('Then, Error page should be rendered', () => {
      const html = BillsUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
    test(('should be sent to bill handleClickNewBill'), () => {
        // Arrange
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Admin' }))
      document.body.innerHTML = BillsUI({ data: bills })
      const bill = new Bills({ document, onNavigate, localStorage });
      const handleClickNewBill = jest.fn(bill.handleClickNewBill)
      const disco = screen.getByTestId('btn-new-bill')
      disco.addEventListener('click', handleClickNewBill)
      userEvent.click(disco)
      expect(handleClickNewBill).toHaveBeenCalled()
    })
    fit(('should be sent to bill handleClickIconEye'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Admin' }))
      document.body.innerHTML = BillsUI({ data: bills })

      const bill = new Bills({ document, onNavigate, localStorage });
      const iconEye = screen.getAllByTestId('icon-eye')
      
      const handleClickIconEye = jest.fn(bill.handleClickNewBill)
      
      for (const icon of iconEye) {
        icon.addEventListener('click', (e) => handleClickIconEye(icon))
      }

      userEvent.click(eye[0])
      expect(handleClickIconEye).toHaveBeenCalled()
/*       const modale = document.getElementsByClassName('modal-body')
      expect(modale).toBeTruthy() */
    })
    fit(('should be sent sent to bill getBills'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Admin' }))
      document.body.innerHTML = BillsUI({ data: bills })

      const firestore = null;
      const bill = new Bills({ document, onNavigate, firestore, localStorage });
      const test = bill.getBills().then(data => expect(data).toEqual(bills));;
      console.log(test);
    })


  })




})