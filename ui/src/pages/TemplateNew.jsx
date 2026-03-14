import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Mail,
  Type,
  Users,
  Hash,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Image,
  Quote,
  Minus,
  Code,
  FileText,
  Eye,
  Sparkles,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown
} from "lucide-react";

export default function TemplateNew() {
  const API_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8000/api/v1" : "/api/v1";
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  const [mailingLists, setMailingLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editorMode, setEditorMode] = useState("visual");
  const [devicePreview, setDevicePreview] = useState("desktop");
  const [showVariables, setShowVariables] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    content_text: "",
    content_html: "",
    mailing_list: ""
  });

  const token = localStorage.getItem("access");

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch mailing lists
  useEffect(() => {
    fetchMailingLists();
  }, []);

  // Auto-save effect
  useEffect(() => {
    let timer;
    if (autoSave && templateForm.name) {
      timer = setTimeout(() => {
        handleAutoSave();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [templateForm, autoSave]);

  const fetchMailingLists = async () => {
    try {
      const response = await axios.get(`${API_URL}/mailing-lists/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMailingLists(response.data.results);
    } catch (err) {
      console.error("Error fetching mailing lists:", err);
    }
  };

  const handleAutoSave = async () => {
    if (!templateForm.name) return;
    
    try {
      const payload = {
        name: templateForm.name,
        subject: templateForm.subject,
        content_text: templateForm.content_text,
        content_html: templateForm.content_html,
        mailing_list: templateForm.mailing_list || null
      };

      // This would need a draft endpoint in production
      setLastSaved(new Date());
    } catch (err) {
      console.error("Auto-save error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!templateForm.content_html && !templateForm.content_text) {
        setMessage({ type: "error", text: "❌ Please provide either HTML or plain text content." });
        setLoading(false);
        return;
      }

      const payload = {
        name: templateForm.name,
        subject: templateForm.subject,
        content_text: templateForm.content_text || templateForm.content_html.replace(/<[^>]*>/g, ''),
        content_html: templateForm.content_html || templateForm.content_text,
        mailing_list: templateForm.mailing_list || null
      };
      function getCsrfToken() {
      let cookieValue = null;
      const name = 'csrftoken';
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

      
      // Configure axios (simple!)
      

      // Set the CSRF token globally (run once when app loads)
      const csrfToken = getCsrfToken() 
      axios.defaults.headers.common['X-CSRFToken'] = csrfToken;

      const response = await axios.post(
        `${API_URL}/templates/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: `✅ Template "${response.data.name}" created successfully.` });
      
      // Redirect back to templates list after short delay
      setTimeout(() => {
        navigate("/templates");
      }, 1500);
      
    } catch (err) {
      console.error("Error saving template:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "❌ Error saving template. Please check all fields." 
      });
      setLoading(false);
    }
  };

  const insertTag = (tag) => {
    const textarea = document.getElementById(editorMode === 'html' ? 'html-editor' : 'text-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editorMode === 'html' ? templateForm.content_html : templateForm.content_text;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    if (editorMode === 'html') {
      setTemplateForm({
        ...templateForm,
        content_html: before + tag + after
      });
    } else {
      setTemplateForm({
        ...templateForm,
        content_text: before + tag + after
      });
    }
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const insertVariable = (variable) => {
    insertTag(`{{${variable}}}`);
  };

  const variables = [
    { name: "name", description: "Subscriber's full name", icon: Users },
    { name: "email", description: "Subscriber's email address", icon: Mail },
    { name: "unsubscribe_url", description: "Unsubscribe link", icon: Link2 },
    { name: "company_name", description: "Your company name", icon: Sparkles },
    { name: "current_year", description: "Current year", icon: Hash },
  ];

  const ToolbarButton = ({ icon: Icon, action, title }) => (
    <button
      type="button"
      onClick={action}
      style={{
        padding: '8px',
        border: 'none',
        background: 'none',
        borderRadius: '6px',
        color: '#4b5563',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f3f4f6';
        e.currentTarget.style.color = '#111827';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#4b5563';
      }}
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  const getPreviewWidth = () => {
    switch (devicePreview) {
      case 'mobile': return '100%';
      case 'tablet': return '100%';
      default: return '100%';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/templates')}
              style={{
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <ArrowLeft size={18} />
              Back to Templates
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }} />
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Create New Template
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setAutoSave(!autoSave)}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: autoSave ? '#dcfce7' : '#f3f4f6',
                borderRadius: '8px',
                color: autoSave ? '#166534' : '#4b5563',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle size={16} />
              {autoSave ? 'Auto-save ON' : 'Auto-save OFF'}
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!templateForm.name || loading}
              style={{
                padding: '8px 20px',
                border: 'none',
                background: !templateForm.name || loading ? '#9ca3af' : 'linear-gradient(to right, #4f46e5, #4338ca)',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: !templateForm.name || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !templateForm.name || loading ? 0.7 : 1
              }}
            >
              <Save size={18} />
              {loading ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Message Display */}
        {message.text && (
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            marginBottom: '24px',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {message.type === "success" ? (
                <CheckCircle size={20} style={{ marginRight: '8px', color: '#22c55e' }} />
              ) : (
                <AlertCircle size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
              )}
              <span style={{ fontWeight: '500' }}>{message.text}</span>
            </div>
            <button 
              onClick={() => setMessage({ type: "", text: "" })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Template Info */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
              Basic Information
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Template Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Type size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    placeholder="e.g., Welcome Email, Newsletter"
                    required
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '12px 12px 12px 40px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#4f46e5';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Email Subject <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                    placeholder="Enter email subject line"
                    required
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '12px 12px 12px 40px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#4f46e5';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Default Mailing List (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }} />
                  <select
                    value={templateForm.mailing_list}
                    onChange={(e) => setTemplateForm({...templateForm, mailing_list: e.target.value})}
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '12px 12px 12px 40px',
                      fontSize: '14px',
                      outline: 'none',
                      appearance: 'none',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#4f46e5';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                   <option value="">-- General Template (No Default List) --</option>
                      {Array.isArray(mailingLists) && mailingLists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name} ({list.subscriber_count || 0} subscribers)
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Variables Panel */}
          <div style={{
            backgroundColor: '#eef2ff',
            borderRadius: '12px',
            border: '1px solid #c7d2fe',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => setShowVariables(!showVariables)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={18} color="#4f46e5" />
                <span style={{ fontWeight: '500', color: '#312e81' }}>Available Variables</span>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#c7d2fe',
                  color: '#312e81',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {variables.length}
                </span>
              </div>
              <ChevronDown size={18} style={{ transform: showVariables ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', color: '#4f46e5' }} />
            </button>
            
            {showVariables && (
              <div style={{
                marginTop: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px'
              }}>
              {Array.isArray(variables) && variables.map((variable) => (
                  <button
                    key={variable.name}
                    type="button"
                    onClick={() => insertVariable(variable.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #c7d2fe',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4f46e5';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#c7d2fe';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <variable.icon size={14} color="#4f46e5" />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                      {'{{'}{variable.name}{'}}'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Editor Toolbar */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px 12px 0 0',
            border: '1px solid #e5e7eb',
            borderBottom: 'none',
            padding: '12px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Mode Tabs */}
            <div style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: '#f3f4f6',
              padding: '4px',
              borderRadius: '8px'
            }}>
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: editorMode === "visual" ? '#ffffff' : 'transparent',
                  color: editorMode === "visual" ? '#4f46e5' : '#6b7280',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: editorMode === "visual" ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <FileText size={16} />
                Visual
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("html")}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: editorMode === "html" ? '#ffffff' : 'transparent',
                  color: editorMode === "html" ? '#4f46e5' : '#6b7280',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: editorMode === "html" ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <Code size={16} />
                HTML
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("preview")}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: editorMode === "preview" ? '#ffffff' : 'transparent',
                  color: editorMode === "preview" ? '#4f46e5' : '#6b7280',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: editorMode === "preview" ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            {/* Formatting Toolbar */}
            {editorMode !== "preview" && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                <ToolbarButton icon={Bold} action={() => insertTag('<strong></strong>')} title="Bold" />
                <ToolbarButton icon={Italic} action={() => insertTag('<em></em>')} title="Italic" />
                <ToolbarButton icon={Underline} action={() => insertTag('<u></u>')} title="Underline" />
                <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />
                <ToolbarButton icon={Heading1} action={() => insertTag('<h1></h1>')} title="Heading 1" />
                <ToolbarButton icon={Heading2} action={() => insertTag('<h2></h2>')} title="Heading 2" />
                <ToolbarButton icon={Heading3} action={() => insertTag('<h3></h3>')} title="Heading 3" />
                <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />
                <ToolbarButton icon={List} action={() => insertTag('<ul>\n  <li></li>\n</ul>')} title="Bullet List" />
                <ToolbarButton icon={ListOrdered} action={() => insertTag('<ol>\n  <li></li>\n</ol>')} title="Numbered List" />
                <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />
                <ToolbarButton icon={Link2} action={() => insertTag('<a href=""></a>')} title="Insert Link" />
                <ToolbarButton icon={Image} action={() => insertTag('<img src="" alt="" />')} title="Insert Image" />
                <ToolbarButton icon={Quote} action={() => insertTag('<blockquote></blockquote>')} title="Quote" />
                <ToolbarButton icon={Minus} action={() => insertTag('<hr />')} title="Horizontal Rule" />
              </div>
            )}

            {/* Preview Device Toggle */}
            {editorMode === "preview" && (
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
                <button
                  onClick={() => setDevicePreview('desktop')}
                  style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: devicePreview === 'desktop' ? '#ffffff' : 'transparent',
                    color: devicePreview === 'desktop' ? '#4f46e5' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  <Monitor size={18} />
                </button>
                <button
                  onClick={() => setDevicePreview('tablet')}
                  style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: devicePreview === 'tablet' ? '#ffffff' : 'transparent',
                    color: devicePreview === 'tablet' ? '#4f46e5' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  <Tablet size={18} />
                </button>
                <button
                  onClick={() => setDevicePreview('mobile')}
                  style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: devicePreview === 'mobile' ? '#ffffff' : 'transparent',
                    color: devicePreview === 'mobile' ? '#4f46e5' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  <Smartphone size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: editorMode === "preview" ? '12px' : '0 0 12px 12px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            marginBottom: '24px'
          }}>
            {editorMode === "html" ? (
              <textarea
                id="html-editor"
                value={templateForm.content_html}
                onChange={(e) => {
                  setTemplateForm({...templateForm, content_html: e.target.value});
                  const plainText = e.target.value.replace(/<[^>]*>/g, '');
                  setTemplateForm(prev => ({...prev, content_text: plainText}));
                }}
                rows={20}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  outline: 'none',
                  resize: 'vertical',
                  backgroundColor: '#f8fafc'
                }}
                placeholder="<html><body><h1>Hello {{name}}!</h1></body></html>"
              />
            ) : editorMode === "visual" ? (
              <textarea
                id="text-editor"
                value={templateForm.content_text}
                onChange={(e) => setTemplateForm({...templateForm, content_text: e.target.value})}
                rows={20}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  outline: 'none',
                  resize: 'vertical'
                }}
                placeholder="Enter your email content here..."
              />
            ) : (
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                padding: '24px',
                minHeight: '400px',
                maxWidth: devicePreview === 'mobile' ? '375px' : devicePreview === 'tablet' ? '768px' : '100%',
                margin: '0 auto',
                transition: 'all 0.3s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ marginBottom: '16px', padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                    <strong>Subject:</strong> {templateForm.subject || 'No subject'}
                  </p>
                </div>
                {templateForm.content_html ? (
                  <div dangerouslySetInnerHTML={{ __html: templateForm.content_html }} />
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>
                    {templateForm.content_text}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Help Text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f9fafb',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <HelpCircle size={14} />
                Use {'{{variable}}'} for dynamic content
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Code size={14} />
                HTML supported
              </span>
            </div>
            {lastSaved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a' }}>
                <CheckCircle size={14} />
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}