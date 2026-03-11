// components/LinkPopup.jsx
import React, { useState } from 'react';
import { MdClose, MdLink, MdImage, MdAttachFile, MdUpload } from 'react-icons/md';

export default function LinkPopup({ 
  linkType, 
  position, 
  onSubmit, 
  onCancel,
  existingLink = null,
  plans = [],
  photos = [],
  files = []
}) {
  const [selectedPlan, setSelectedPlan] = useState(existingLink?.planId || '');
  const [selectedPhoto, setSelectedPhoto] = useState(existingLink?.photoId || '');
  const [selectedFile, setSelectedFile] = useState(existingLink?.fileId || '');
  const [uploadedPhoto, setUploadedPhoto] = useState(existingLink?.uploadedPhoto || null);
  const [uploadedFile, setUploadedFile] = useState(existingLink?.uploadedFile || null);
  const [activeTab, setActiveTab] = useState(existingLink ? 'existing' : 'existing');

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedPhoto({
        name: file.name,
        data: event.target.result,
        file: file
      });
      setSelectedPhoto(''); // Clear existing selection
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        data: event.target.result,
        file: file
      });
      setSelectedFile(''); // Clear existing selection
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    let linkData = { type: linkType };

    if (linkType === 'plan') {
      if (!selectedPlan) {
        alert('Please select a plan');
        return;
      }
      const plan = plans.find(p => p.id === selectedPlan);
      linkData = { ...linkData, planId: selectedPlan, planName: plan?.name };
    } else if (linkType === 'photo') {
      if (!selectedPhoto && !uploadedPhoto) {
        alert('Please select or upload a photo');
        return;
      }
      if (uploadedPhoto) {
        linkData = { ...linkData, uploadedPhoto };
      } else {
        const photo = photos.find(p => p.id === selectedPhoto);
        linkData = { ...linkData, photoId: selectedPhoto, photoUrl: photo?.url };
      }
    } else if (linkType === 'file') {
      if (!selectedFile && !uploadedFile) {
        alert('Please select or upload a file');
        return;
      }
      if (uploadedFile) {
        linkData = { ...linkData, uploadedFile };
      } else {
        const file = files.find(f => f.id === selectedFile);
        linkData = { ...linkData, fileId: selectedFile, fileName: file?.name };
      }
    }

    onSubmit(linkData);
  };

  const getTitle = () => {
    if (existingLink) {
      return linkType === 'plan' ? 'Plan Details' : 
             linkType === 'photo' ? 'View Photo' : 'View File';
    }
    return linkType === 'plan' ? 'Link to Plan' : 
           linkType === 'photo' ? 'Add Photo' : 'Add File';
  };

  const getIcon = () => {
    if (linkType === 'plan') return <MdLink className="text-primary" size={24} />;
    if (linkType === 'photo') return <MdImage className="text-secondary" size={24} />;
    return <MdAttachFile className="text-tertiary" size={24} />;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-gray-900 font-semibold text-lg">{getTitle()}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Plan Selection */}
          {linkType === 'plan' && (
            <div className="space-y-3">
              {existingLink ? (
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Plan ID</div>
                  <div className="text-gray-900 font-mono text-lg">{existingLink.planId}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-1">Plan Name</div>
                  <div className="text-gray-900">{existingLink.planName || 'N/A'}</div>
                </div>
              ) : (
                <>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Select Plan
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">-- Select a Plan --</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} (ID: {plan.id})
                      </option>
                    ))}
                  </select>
                  {selectedPlan && (
                    <div className="bg-primary-100/30 rounded p-3 border border-primary-100 mt-2">
                      <div className="text-xs text-primary font-semibold">Selected Plan Details</div>
                      <div className="text-sm text-gray-700 mt-1">
                        {plans.find(p => p.id === selectedPlan)?.description || 'No description'}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Photo Selection/Upload */}
          {linkType === 'photo' && (
            <div className="space-y-4">
              {existingLink ? (
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  {existingLink.uploadedPhoto ? (
                    <>
                      <div className="text-sm text-gray-500 mb-2">Uploaded Photo</div>
                      <img 
                        src={existingLink.uploadedPhoto.data} 
                        alt={existingLink.uploadedPhoto.name}
                        className="w-full rounded border border-gray-200 shadow-sm"
                      />
                      <div className="text-xs text-gray-400 mt-2">
                        {existingLink.uploadedPhoto.name}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-gray-500 mb-2">Linked Photo</div>
                      <img 
                        src={existingLink.photoUrl} 
                        alt="Linked photo"
                        className="w-full rounded border border-gray-200 shadow-sm"
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('existing')}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'existing'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Select Existing
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'upload'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Upload New
                    </button>
                  </div>

                  {/* Existing Photos */}
                  {activeTab === 'existing' && (
                    <div className="space-y-2">
                      <label className="block text-gray-600 text-sm font-medium">
                        Select Photo
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                        {photos.map((photo) => (
                          <div
                            key={photo.id}
                            onClick={() => setSelectedPhoto(photo.id)}
                            className={`cursor-pointer rounded border-2 transition-all p-1 ${
                              selectedPhoto === photo.id
                                ? 'border-primary ring-2 ring-primary/10'
                                : 'border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <img 
                              src={photo.url} 
                              alt={photo.name}
                              className="w-full h-24 object-cover rounded-sm"
                            />
                            <div className="p-1 text-[10px] text-gray-500 truncate">
                              {photo.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New Photo */}
                  {activeTab === 'upload' && (
                    <div className="space-y-3">
                      <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-gray-50 transition-all cursor-pointer">
                          <MdUpload className="mx-auto text-gray-400 mb-2" size={32} />
                          <div className="text-gray-900 text-sm font-medium mb-1">Upload Photo</div>
                          <div className="text-gray-500 text-xs">PNG, JPG up to 10MB</div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {uploadedPhoto && (
                        <div className="bg-gray-50 rounded p-3 border border-gray-200">
                          <img 
                            src={uploadedPhoto.data} 
                            alt={uploadedPhoto.name}
                            className="w-full rounded mb-2"
                          />
                          <div className="text-xs text-gray-500 font-medium">{uploadedPhoto.name}</div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* File Selection/Upload */}
          {linkType === 'file' && (
            <div className="space-y-4">
              {existingLink ? (
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-tertiary/10 rounded">
                      <MdAttachFile className="text-tertiary" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium">
                        {existingLink.uploadedFile?.name || existingLink.fileName}
                      </div>
                      {existingLink.uploadedFile && (
                        <div className="text-xs text-gray-500">
                          {(existingLink.uploadedFile.size / 1024).toFixed(2)} KB
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('existing')}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'existing'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Select Existing
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'upload'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Upload New
                    </button>
                  </div>

                  {/* Existing Files */}
                  {activeTab === 'existing' && (
                    <div className="space-y-2">
                      <label className="block text-gray-600 text-sm font-medium">
                        Select File
                      </label>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            onClick={() => setSelectedFile(file.id)}
                            className={`flex items-center gap-3 p-3 rounded border-2 cursor-pointer transition-all ${
                              selectedFile === file.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <MdAttachFile className="text-tertiary" size={24} />
                            <div className="flex-1">
                              <div className="text-gray-900 text-sm font-medium">{file.name}</div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{file.type}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New File */}
                  {activeTab === 'upload' && (
                    <div className="space-y-3">
                      <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-gray-50 transition-all cursor-pointer">
                          <MdUpload className="mx-auto text-gray-400 mb-2" size={32} />
                          <div className="text-gray-900 text-sm font-medium mb-1">Upload File</div>
                          <div className="text-gray-500 text-xs">PDF, DOC, or Spreadsheet</div>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {uploadedFile && (
                        <div className="bg-gray-50 rounded p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <MdAttachFile className="text-tertiary" size={28} />
                            <div className="flex-1">
                              <div className="text-gray-900 font-medium text-sm">{uploadedFile.name}</div>
                              <div className="text-[10px] text-gray-500">
                                {uploadedFile.type} • {(uploadedFile.size / 1024).toFixed(2)} KB
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!existingLink && (
          <div className="flex gap-2 p-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary hover:opacity-90 text-white rounded transition-colors font-semibold"
            >
              {linkType === 'plan' ? 'Link Plan' : linkType === 'photo' ? 'Add Photo' : 'Add File'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}