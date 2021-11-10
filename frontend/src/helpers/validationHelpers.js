//helper functions for generating error messages for diffrent form inputs.

// #################### Validating Name! ###########################

// @desc    handles name input blur event
// @params  value, error state setter
// @returns nothing
export const nameInputBlurHandler = (name, setError) => {
  if (name === '') {
    setError('This field cannot be empty!')
  } else if (name.length < 4) {
    setError('This field should have atleast 4 charecters.')
  } else if (name.slice(-1) === ' ') {
    setError('should not end with space.')
  } else {
    setError('')
  }
}

// @desc    handles name input change event
// @params  value, error state setter
// @returns nothing
export const nameInputChangeHandler = (name, setError) => {
  if (name.length === 0) {
    setError('This field cannot be empty!')
  } else if (name.charAt(0) === ' ') {
    setError('should not start with space.')
  } else if (name.includes('  ')) {
    setError('should not contain consecutive spaces.')
  } else if (/\d/.test(name)) {
    setError('should not contain numbers.')
  } else if (!name.match(/^[a-zA-Z ]+$/)) {
    setError('Invalid charecter!')
  } else if (name === '') {
    setError('This field cannot be empty!')
  } else if (name.length < 4) {
    setError('This field should have atleast 4 charecters.')
  } else if (name.slice(-1) === ' ') {
    setError('should not end with space.')
  } else {
    setError('')
  }
}

// #################### Validating Email! ###########################

// @desc    handles email input blur event
// @params  email, error state setter
// @returns nothing
export const emailInputBlurHandler = (email, setError) => {
  if (email === '') {
    setError('This field cannot be empty!')
  } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    setError('This email id is not valid.')
  } else {
    setError('')
  }
}

// @desc    handles email input change event
// @params  email, error setter
// @returns nothing
export const emailInputChangeHandler = (email, setError) => {
  if (email.includes(' ')) {
    setError('Email id should not contain space.')
  }
  // if (
  //   emailError === 'Email id should not contain space.' ||
  //   email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  // )
  else {
    setError('')
  }
}

//######################### Validating phone number! ###########################

export const phoneInputBlurHandler = (phone) => {
  if (phone === '') {
    return 'This field cannot be empty!'
  } else if (phone.length < 10) {
    return 'Phone number does not have 10 digits'
  } else if (phone.length > 10) {
    return 'Phone number has more than 10 digits'
  } else {
    return null
  }
}

export const phoneInputChangeHandler = (phone, phoneError) => {
  if (!phone.match(/^\d{10}$/) && phone !== '') {
    return 'Enter numbers only!'
  } else if (phone.length > 10) {
    return 'Phone number has more than 10 digits'
  }
  //  if (
  //   phoneError == 'Phone number should not contain space.' ||
  //   phoneError == 'Enter numbers only!' ||
  //   phoneError == 'Phone number has more than 10 digits'
  // )
  else {
    return null
  }
}

//######################### Validating Password! ###########################

// @desc    handles password input blur event
// @params  password, error setter
// @returns nothing
export const passwordInputBlurHandler = (password, setError) => {
  if (password === '') {
    setError('This field cannot be empty!')
  } else if (password.length < 5) {
    setError('password should have atleast 5 charecters')
  } else if (password.length > 20) {
    setError('password should not exceed 20 characters')
  } else {
    setError('')
  }
}

// @desc    handles password input change event
// @params  password, error setter
// @returns nothing
export const passwordInputChangeHandler = (password, setError) => {
  if (password.length > 20) {
    setError('password should not exceed 20 characters')
  } else {
    setError('')
  }
}

// #################### Validating Address or similar stuff! ###########################

// @desc    handles address input blur event
// @params  event object, error state setter
// @returns no return value
export const addressInputBlurHandler = (value, setError) => {
  if (value === '') {
    setError('This field cannot be empty!')
  } else if (value.length < 4) {
    setError('This field should have atleast 4 charecters.')
  } else if (value.slice(-1) === ' ') {
    setError('This field should not end with space.')
  } else {
    setError('')
  }
}

// @desc    handles address input change event
// @params  value, error state setter
// @returns no return value
export const addressInputChangeHandler = (value, setError) => {
  if (value.length === 0) {
    setError('')
  } else if (value.charAt(0) === ' ') {
    setError('should not start with space.')
  } else if (value.length < 4) {
    setError('This field should have atleast 4 charecters.')
  } else if (value.includes('  ')) {
    setError('should not contain consecutive spaces.')
  } else if (value.slice(-1) === ' ') {
    setError('This field should not end with space.')
  } else {
    setError('')
  }
}

//######################### Validating Postal Code! ###########################

// @desc    handles postal code(or any 6 digit number) input change event
// @params  postal code, error state setter
// @returns nothing
export const postalCodeInputBlurHandler = (postalCode, setError) => {
  if (postalCode === '') {
    setError('This field cannot be empty!')
  } else if (postalCode.length !== 6) {
    setError('Postal Code should have 6 digits')
  } else {
    setError('')
  }
}

// @desc    handles postal code input blur event
// @params  postal code, error state setter
// @returns nothing
export const postalCodeInputChangeHandler = (postalCode, setError) => {
  if (postalCode === '') {
    setError('This field cannot be empty!')
  } else if (!postalCode.match(/^\d{6}$/) && postalCode !== '') {
    setError('Enter numbers only!')
  } else if (postalCode.length > 6) {
    setError('postalCode should not have more than 6 digits')
  } else {
    setError('')
  }
}

//######################### Validating Prices! ###########################

// @desc    handles Price (or similar values) input change event
// @params  price, error state setter
// @returns nothing
export const priceInputBlurHandler = (price, setError) => {
  if (price === '') {
    setError('This field cannot be empty!')
  } else if (Number(price) < 0) {
    setError('Negative numbers are not allowed')
  }
  // else if (!price.match(/^\d+(,\d{1,2})?$/)) {
  //   setError('Enter a valid number!')
  // }
  else {
    setError('')
  }
}

// @desc    handles price input blur event
// @params  price, error state setter
// @returns nothing
export const priceInputChangeHandler = (price, setError) => {
  if (price === '') {
    setError('This field cannot be empty!')
  } else if (!price.match(/^\d+(,\d{1,2})?$/)) {
    setError('Enter a valid number!')
  } else {
    setError('')
  }
}

//######################### Validating Percentages! ###########################

// @desc    handles Percentages (0-100 without percent symbol) input change event
// @params  percentage, error state setter
// @returns nothing
export const percentageInputBlurHandler = (percentage, setError) => {
  if (percentage === '') {
    setError('This field cannot be empty!')
  } else if (Number(percentage) < 0) {
    setError('Negative numbers are not allowed')
  }
  // else if (!percentage.match(/\\d+(?:\\.\\d+)?/)) {
  //   setError('Enter a valid percentage!')
  // }
  else {
    setError('')
  }
}

// @desc    handles percentage input blur event
// @params  percentage, error state setter
// @returns nothing
export const percentageInputChangeHandler = (percentage, setError) => {
  if (percentage === '') {
    setError('This field cannot be empty!')
  } else if (!percentage.match(/\\d+(?:\\.\\d+)?/)) {
    setError('Enter a valid percentage!')
  } else {
    setError('')
  }
}
