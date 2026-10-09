import { useState } from 'react'
import { readSheet } from 'read-excel-file/browser'
import CampaignStepOne from '../components/CampaignStepOne.jsx'
import CampaignStepTwo from '../components/CampaignStepTwo.jsx'
import PhonePreview from '../components/PhonePreview.jsx'
import SuccessPopup from '../components/SuccessPopup.jsx'
import { wabaAccounts, templates } from '../data/campaignData.js'
import './PushCampaign.css'

// Starting values of the form. Also used to clear the form after submit.
const emptyForm = {
  // Step 1
  campaignName: '',
  wabaAccount: '',
  templateType: '',
  templateId: '',
  // Step 2
  audienceType: 'File',
  numberFile: null,
  group: '',
  tag: '',
  mediaFile: null,
  useWorkflow: false,
  workflow: '',
  country: '91',
  mobileField: '',
  isScheduled: false,
  scheduleDate: '',
  scheduleTime: '',
}

// Header names that we accept as the mobile number column of the file.
// Written in small letters without spaces, because we compare them that way.
const mobileColumnNames = ['mobilenumber', 'number', 'phonenumber']

// Makes a header easy to compare: "Mobile Number" becomes "mobilenumber"
function simpleName(header) {
  return String(header).toLowerCase().replaceAll(' ', '').replaceAll('_', '')
}

function PushCampaign() {
  const [step, setStep] = useState(1) // 1 or 2
  const [form, setForm] = useState(emptyForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Mobile number columns found in the uploaded file (shown in the dropdown)
  const [mobileColumns, setMobileColumns] = useState([])

  // Temporary link to the chosen media file, used by the phone preview
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('')

  // Find the full details of what the user selected in the dropdowns
  const selectedAccount = wabaAccounts.find(
    (account) => account.id === form.wabaAccount,
  )
  const selectedTemplate = templates.find(
    (template) => template.id === form.templateId,
  )
  const mediaType = selectedTemplate ? selectedTemplate.mediaType : ''

  // Changes one value of the form and hides old messages
  function updateField(name, value) {
    setForm({ ...form, [name]: value })
    setErrorMessage('')
    setSuccessMessage('')
  }

  // Removes the media preview and frees the memory used by its link
  function clearMediaPreview() {
    if (mediaPreviewUrl !== '') {
      URL.revokeObjectURL(mediaPreviewUrl)
    }
    setMediaPreviewUrl('')
  }

  // When the type changes, the old template does not match any more, so clear it
  function handleTemplateTypeChange(value) {
    clearMediaPreview()
    setForm({ ...form, templateType: value, templateId: '', mediaFile: null })
    setErrorMessage('')
    setSuccessMessage('')
  }

  // A new template can need a different kind of media, so clear the old media file
  function handleTemplateChange(value) {
    clearMediaPreview()
    setForm({ ...form, templateId: value, mediaFile: null })
    setErrorMessage('')
    setSuccessMessage('')
  }

  // Runs when the user picks a media file. Saves it and makes a link
  // to the file, so the phone preview can show it.
  function handleMediaFileChange(file) {
    clearMediaPreview()
    if (file) {
      setMediaPreviewUrl(URL.createObjectURL(file))
    }
    setForm({ ...form, mediaFile: file || null })
    setErrorMessage('')
    setSuccessMessage('')
  }

  // Runs when the user picks a mobile number file.
  // It reads the first row (the headers) and keeps the mobile number columns.
  async function handleNumberFileChange(file) {
    setErrorMessage('')
    setSuccessMessage('')

    // The user closed the file window without picking a file
    if (!file) {
      setMobileColumns([])
      setForm((oldForm) => ({ ...oldForm, numberFile: null, mobileField: '' }))
      return
    }

    let headers = []
    try {
      const rows = await readSheet(file)
      headers = rows[0] || [] // first row of the sheet
    } catch {
      setMobileColumns([])
      setForm((oldForm) => ({ ...oldForm, numberFile: null, mobileField: '' }))
      setErrorMessage('Could not read this file. Please upload a valid .xlsx file.')
      return
    }

    // Keep only the headers that are a mobile number column
    const columns = []
    for (const header of headers) {
      if (header && mobileColumnNames.includes(simpleName(header))) {
        columns.push(String(header))
      }
    }

    setMobileColumns(columns)
    setForm((oldForm) => ({
      ...oldForm,
      numberFile: file,
      // If the file has only one mobile number column, select it automatically
      mobileField: columns.length === 1 ? columns[0] : '',
    }))

    if (columns.length === 0) {
      setErrorMessage(
        'No mobile number column found in this file. The header must be named MobileNumber, Number or PhoneNumber.',
      )
    }
  }

  // Returns an error text, or '' when step 1 is filled correctly
  function checkStepOne() {
    if (form.campaignName.trim() === '') return 'Please enter a campaign name.'
    if (form.wabaAccount === '') return 'Please select a Waba account.'
    if (form.templateType === '') return 'Please select a template type.'
    if (form.templateId === '') return 'Please select a template.'
    return ''
  }

  // Returns an error text, or '' when step 2 is filled correctly
  function checkStepTwo() {
    if (form.audienceType === 'File') {
      if (!form.numberFile) return 'Please choose a mobile number file.'
      if (form.mobileField === '') return 'Please select the mobile number field.'
    }
    if (form.audienceType === 'Group' && form.group === '') {
      return 'Please select a group.'
    }
    if (form.audienceType === 'Tag' && form.tag === '') {
      return 'Please select a tag.'
    }
    if (mediaType !== 'Text' && !form.mediaFile) {
      return 'Please choose a media file.'
    }
    if (form.useWorkflow && form.workflow === '') {
      return 'Please select a workflow.'
    }
    if (form.isScheduled && form.scheduleDate === '') {
      return 'Please select the schedule date.'
    }
    if (form.isScheduled && form.scheduleTime === '') {
      return 'Please select the schedule time.'
    }
    return ''
  }

  function goToStepOne() {
    setErrorMessage('')
    setStep(1)
  }

  // Step 2 opens only when step 1 is complete
  function goToStepTwo() {
    const error = checkStepOne()
    if (error !== '') {
      setErrorMessage(error)
      return
    }
    setErrorMessage('')
    setSuccessMessage('')
    setStep(2)
  }

  function handleSubmit(event) {
    event.preventDefault() // stop the browser from reloading the page

    // Pressing Enter on step 1 should just move to step 2
    if (step === 1) {
      goToStepTwo()
      return
    }

    const error = checkStepOne() || checkStepTwo()
    if (error !== '') {
      setErrorMessage(error)
      return
    }

    // TODO (backend): send "form" to the API here

    // Clear the form and show the success message
    setForm(emptyForm)
    setMobileColumns([])
    clearMediaPreview()
    setStep(1)
    setErrorMessage('')
    setSuccessMessage('WhatsApp message sent successfully')
  }

  return (
    <div>
      <h1 className="page-title">Push Campaign</h1>

      <div className="campaign">
        <form className="card campaign-form" onSubmit={handleSubmit} noValidate>
          {/* Step 1 / Step 2 buttons */}
          <div className="steps">
            <button
              type="button"
              className={step === 1 ? 'step active' : 'step'}
              onClick={goToStepOne}
            >
              Step 1
            </button>
            <button
              type="button"
              className={step === 2 ? 'step active' : 'step'}
              onClick={goToStepTwo}
            >
              Step 2
            </button>
          </div>

          {errorMessage !== '' && (
            <p className="alert alert-error" role="alert">
              {errorMessage}
            </p>
          )}

          {step === 1 ? (
            <CampaignStepOne
              form={form}
              updateField={updateField}
              onTemplateTypeChange={handleTemplateTypeChange}
              onTemplateChange={handleTemplateChange}
              mediaType={mediaType}
            />
          ) : (
            <CampaignStepTwo
              form={form}
              updateField={updateField}
              mediaType={mediaType}
              mobileColumns={mobileColumns}
              onNumberFileChange={handleNumberFileChange}
              onMediaFileChange={handleMediaFileChange}
            />
          )}

          <div className="campaign-buttons">
            {step === 1 ? (
              <button type="button" className="btn btn-primary" onClick={goToStepTwo}>
                Next
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-secondary" onClick={goToStepOne}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </>
            )}
          </div>
        </form>

        <PhonePreview
          companyName={selectedAccount ? selectedAccount.name : 'My Company'}
          message={selectedTemplate ? selectedTemplate.body : ''}
          mediaType={mediaType}
          mediaUrl={mediaPreviewUrl}
          mediaName={form.mediaFile ? form.mediaFile.name : ''}
        />
      </div>

      {/* Shown after submit. It closes when the user clicks OK. */}
      {successMessage !== '' && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
    </div>
  )
}

export default PushCampaign
