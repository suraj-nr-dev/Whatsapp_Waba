import {
  audienceTypes,
  groups,
  tags,
  workflows,
  countries,
} from '../data/campaignData.js'

// Today's date as YYYY-MM-DD, so the user cannot schedule on a past date
const today = new Date().toLocaleDateString('en-CA')

// Step 2 of the Push Campaign form.
// form               = all the form values
// updateField        = function to change one value
// mediaType          = media type of the selected template (Text, Image, Video, Document)
// mobileColumns      = mobile number columns found in the uploaded file
// onNumberFileChange = function called when the user picks a mobile number file
// onMediaFileChange  = function called when the user picks a media file
function CampaignStepTwo({
  form,
  updateField,
  mediaType,
  mobileColumns,
  onNumberFileChange,
  onMediaFileChange,
}) {

  // A text template has no media, so the media file box is switched off
  const needsMedia = mediaType !== 'Text'

  // Which files the media box should allow
  let mediaAccept = ''
  if (mediaType === 'Image') mediaAccept = 'image/*'
  if (mediaType === 'Video') mediaAccept = 'video/*'
  if (mediaType === 'Document') mediaAccept = '.pdf'

  return (
    <div className="campaign-grid">
      {/* ---------- Left side ---------- */}
      <div>
        <div className="form-group">
          <label className="form-label" htmlFor="audienceType">
            Send To
          </label>
          <select
            id="audienceType"
            className="form-control"
            value={form.audienceType}
            onChange={(event) => updateField('audienceType', event.target.value)}
          >
            {audienceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Only one of the next 3 boxes is shown, based on "Send To" */}
        {form.audienceType === 'File' && (
          <div className="form-group">
            <label className="form-label" htmlFor="numberFile">
              Choose mobile number file
            </label>
            <input
              id="numberFile"
              type="file"
              className="file-input"
              accept=".xlsx"
              onChange={(event) => onNumberFileChange(event.target.files[0])}
            />
            <p className="form-hint">
              {form.numberFile
                ? 'Selected: ' + form.numberFile.name
                : 'Max 3 lakh records. Only .xlsx files allowed'}
            </p>
          </div>
        )}

        {form.audienceType === 'Group' && (
          <div className="form-group">
            <label className="form-label" htmlFor="group">
              Select group
            </label>
            <select
              id="group"
              className="form-control"
              value={form.group}
              onChange={(event) => updateField('group', event.target.value)}
            >
              <option value="">Select group</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.audienceType === 'Tag' && (
          <div className="form-group">
            <label className="form-label" htmlFor="tag">
              Select tag
            </label>
            <select
              id="tag"
              className="form-control"
              value={form.tag}
              onChange={(event) => updateField('tag', event.target.value)}
            >
              <option value="">Select tag</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="mediaFile">
            Choose media file
          </label>
          <input
            id="mediaFile"
            type="file"
            className="file-input"
            accept={mediaAccept}
            disabled={!needsMedia}
            onChange={(event) => onMediaFileChange(event.target.files[0])}
          />
          <p className="form-hint">
            {!needsMedia && 'This template is text only, no media file needed'}
            {needsMedia && form.mediaFile && 'Selected: ' + form.mediaFile.name}
            {needsMedia && !form.mediaFile && 'Template media type: ' + mediaType}
          </p>
        </div>
      </div>

      {/* ---------- Right side ---------- */}
      <div>
        <div className="form-group">
          <label className="check-label">
            <input
              type="checkbox"
              checked={form.useWorkflow}
              onChange={(event) => updateField('useWorkflow', event.target.checked)}
            />
            Use workflow
          </label>
          <select
            className="form-control"
            aria-label="Workflow"
            value={form.workflow}
            disabled={!form.useWorkflow}
            onChange={(event) => updateField('workflow', event.target.value)}
          >
            <option value="">Select Workflow</option>
            {workflows.map((workflow) => (
              <option key={workflow} value={workflow}>
                {workflow}
              </option>
            ))}
          </select>
        </div>

        {/* Country and mobile number column are only needed for a file */}
        {form.audienceType === 'File' && (
          <div className="campaign-country-row">
            <div className="form-group">
              <label className="form-label" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                className="form-control"
                value={form.country}
                onChange={(event) => updateField('country', event.target.value)}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mobileField">
                Select mobile number field
              </label>
              {/* The options come from the headers of the uploaded file */}
              <select
                id="mobileField"
                className="form-control"
                value={form.mobileField}
                disabled={mobileColumns.length === 0}
                onChange={(event) => updateField('mobileField', event.target.value)}
              >
                <option value="">
                  {form.numberFile ? 'Select mobile number field' : 'Upload a file first'}
                </option>
                {mobileColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="check-label">
            <input
              type="checkbox"
              checked={form.isScheduled}
              onChange={(event) => updateField('isScheduled', event.target.checked)}
            />
            Schedule
          </label>
          {/* Date and time boxes show only when Schedule is ticked */}
          {form.isScheduled && (
            <div className="campaign-schedule-row">
              <div>
                <label className="form-label" htmlFor="scheduleDate">
                  Date
                </label>
                <input
                  id="scheduleDate"
                  type="date"
                  className="form-control"
                  min={today}
                  value={form.scheduleDate}
                  onChange={(event) => updateField('scheduleDate', event.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="scheduleTime">
                  Time
                </label>
                <input
                  id="scheduleTime"
                  type="time"
                  className="form-control"
                  value={form.scheduleTime}
                  onChange={(event) => updateField('scheduleTime', event.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampaignStepTwo
