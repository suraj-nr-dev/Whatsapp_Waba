import Icon from './Icon.jsx'
import './PhonePreview.css'

// Small WhatsApp style preview of the message.
// companyName = name shown at the top of the chat
// message     = text of the selected template ('' if none selected)
// mediaType   = Text, Image, Video or Document ('' if none selected)
// mediaUrl    = link to the uploaded media file ('' if no file is uploaded)
// mediaName   = file name of the uploaded media file
function PhonePreview({ companyName, message, mediaType, mediaUrl, mediaName }) {
  const hasMedia = mediaType !== '' && mediaType !== 'Text'
  const hasFile = mediaUrl !== ''

  return (
    <div className="phone">
      <div className="phone-header">
        <Icon name="chevronLeft" />
        <span className="phone-avatar">{companyName.charAt(0).toUpperCase()}</span>
        <div className="phone-name">
          <strong>{companyName}</strong>
          <span>online</span>
        </div>
        <Icon name="video" />
        <Icon name="phone" />
      </div>

      <div className="phone-chat">
        <div className="phone-bubble">
          {/* No file uploaded yet: show a grey box with the media type */}
          {hasMedia && !hasFile && <div className="phone-media">{mediaType}</div>}

          {/* File uploaded: show the real image, video or document name */}
          {hasMedia && hasFile && mediaType === 'Image' && (
            <img className="phone-media-file" src={mediaUrl} alt={mediaName} />
          )}
          {hasMedia && hasFile && mediaType === 'Video' && (
            <video className="phone-media-file" src={mediaUrl} controls />
          )}
          {hasMedia && hasFile && mediaType === 'Document' && (
            <div className="phone-document">
              <Icon name="file" size={28} />
              <span>{mediaName}</span>
            </div>
          )}

          {message === '' ? (
            <p className="phone-empty">Select a template to see the preview</p>
          ) : (
            <p>{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhonePreview
