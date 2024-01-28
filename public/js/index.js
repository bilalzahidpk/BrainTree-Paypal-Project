$(document).ready(() => {
  $('#payment-form').submit(function (event) {
    const cardNumberInput = $('#card-number');
    const startsWithThree = cardNumberInput.val().startsWith('3');

    if (
      (startsWithThree && cardNumberInput.val().length !== 15) ||
      (!startsWithThree && cardNumberInput.val().length !== 16)
    ) {
      alert('Invalid card number length.');
      event.preventDefault();
    }

    if (!/^\d+$/.test(cardNumberInput.val())) {
      alert('Card number must contain only numbers.');
      event.preventDefault();
    }

    const expiryDateInput = $('#expiry-date');
    const expiryDatePattern = /^\d{2}\/\d{2}$/;

    if (!expiryDatePattern.test(expiryDateInput.val())) {
      alert('Please enter a valid expiry date in the format MM/YY.');
      event.preventDefault();
    }

    const cvcInput = $('#cvc');
    const cardNumber = cardNumberInput.val();
    const cvcLength = cardNumber.startsWith('3') ? 4 : 3;

    if (cvcInput.val().length !== cvcLength) {
      alert(`CVC must be ${cvcLength} digits long.`);
      event.preventDefault();
    }

    const currencyInput = $('#currency');
    if (currencyInput.val() === null) {
      alert('Please select a valid currency.');
      event.preventDefault();
    }
  });
});
