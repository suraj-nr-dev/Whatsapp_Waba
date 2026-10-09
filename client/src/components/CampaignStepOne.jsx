import Icon from './Icon.jsx'
import { wabaAccounts, templateTypes, templates } from '../data/campaignData.js'

// Step 1 of the Push Campaign form.
// form                 = all the form values
// updateField          = function to change one value: updateField('campaignName', 'Promo')
// onTemplateTypeChange = function called when the template type changes
// onTemplateChange     = function called when the template changes
// mediaType            = media type of the selected template ('' if none selected)
function CampaignStepOne({
  form,
  updateField,
  onTemplateTypeChange,
  onTemplateChange,
  mediaType,
}) {
  // Show only the templates of the selected type
  const matchingTemplates = templates.filter(
    (template) => template.type === form.templateType,
  )

  return (
    <div className="campaign-grid">
      <div className="form-group">
        <label className="form-label" htmlFor="campaignName">
          Campaign Name
          <span className="info-icon" title="Give a name to find this campaign in reports">
            <Icon name="info" size={16} />
          </span>
        </label>
        <input
          id="campaignName"
          type="text"
          className="form-control"
          placeholder="Enter campaign name"
          value={form.campaignName}
          onChange={(event) => updateField('campaignName', event.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="wabaAccount">
          Waba Account
        </label>
        <select
          id="wabaAccount"
          className="form-control"
          value={form.wabaAccount}
          onChange={(event) => updateField('wabaAccount', event.target.value)}
        >
          <option value="">Select account holder name</option>
          {wabaAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.number})
            </option>
          ))}
        </select>
      </div>

      {/* Template Type and Template sit side by side */}
      <div className="campaign-template-row">
        <div className="form-group">
          <label className="form-label" htmlFor="templateType">
            Template Type
          </label>
          <select
            id="templateType"
            className="form-control"
            value={form.templateType}
            onChange={(event) => onTemplateTypeChange(event.target.value)}
          >
            <option value="">Select Type</option>
            {templateTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="template">
            Template
          </label>
          <select
            id="template"
            className="form-control"
            value={form.templateId}
            disabled={form.templateType === ''}
            onChange={(event) => onTemplateChange(event.target.value)}
          >
            <option value="">Select template</option>
            {matchingTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="mediaType">
          Media Type
        </label>
        {/* Filled automatically from the selected template */}
        <input
          id="mediaType"
          type="text"
          className="form-control"
          value={mediaType}
          readOnly
        />
      </div>
    </div>
  )
}

export default CampaignStepOne
