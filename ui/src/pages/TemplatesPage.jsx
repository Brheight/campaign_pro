import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ChevronRight,
  Mail, 
  Plus,
  X,
  Edit3,
  Trash2,
  Copy,
  Eye,
  Code,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Send,
  LayoutTemplate,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Image,
  List,
  ListOrdered,
  Code2,
  Users,
  Sparkles,
  Grid,
  List as ListIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function NavLink({ to, icon, label, active = false }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        transition: 'all 0.2s',
        margin: '8px 0',
        backgroundColor: active ? 'rgba(30, 64, 175, 0.3)' : 'transparent',
        color: active ? '#ffffff' : '#dbeafe',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.2)';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#dbeafe';
        }
      }}
    >
      <div style={{ color: active ? '#ffffff' : '#bfdbfe' }}>{icon}</div>
      <span style={{ fontWeight: '500' }}>{label}</span>
      <ChevronRight 
        size={16} 
        style={{ 
          marginLeft: 'auto',
          color: active ? '#93c5fd' : 'rgba(191, 219, 254, 0.5)'
        }} 
      />
    </Link>
  );
}

// Template Card Component
const TemplateCard = ({ template, onEdit, onDelete, onDuplicate, onPreview, mailingLists }) => {
  const list = mailingLists.find(l => l.id === template.mailing_list);
  const hasHtml = template.content_html && template.content_html !== template.content_text;
  
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#818cf8';
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(99, 102, 241, 0), rgba(99, 102, 241, 0))',
          transition: 'all 0.5s',
          pointerEvents: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.05))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, rgba(99, 102, 241, 0), rgba(99, 102, 241, 0))';
        }}
      />
      
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
            }}>
              <Mail size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ 
                fontWeight: '600', 
                color: '#111827',
                margin: 0,
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}>
                {template.name}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                {template.subject}
              </p>
            </div>
          </div>
          
          {/* Type Badge */}
          {hasHtml && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: '#f5f3ff',
              color: '#7c3aed',
              border: '1px solid #c7d2fe'
            }}>
              <Code2 size={12} style={{ marginRight: '4px' }} />
              HTML
            </span>
          )}
        </div>
        
        {/* Preview */}
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #f3f4f6'
        }}>
          <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
            {template.content_text?.substring(0, 100)}...
          </p>
        </div>
        
        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {list ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                border: '1px solid #c7d2fe'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#4f46e5',
                  marginRight: '6px',
                  animation: 'pulse 2s infinite'
                }} />
                {list.name}
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: '#f3f4f6',
                color: '#4b5563'
              }}>
                General
              </span>
            )}
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              {new Date(template.created_at).toLocaleDateString()}
            </span>
          </div>
          
          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            opacity: 0,
            transition: 'opacity 0.2s'
          }}
          className="action-icons"
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
            <button
              onClick={() => onPreview(template)}
              style={{
                padding: '8px',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eef2ff';
                e.currentTarget.style.color = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
              title="Preview"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onDuplicate(template)}
              style={{
                padding: '8px',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
                e.currentTarget.style.color = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
              title="Duplicate"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => onEdit(template)}
              style={{
                padding: '8px',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eef2ff';
                e.currentTarget.style.color = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
              title="Edit"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(template.id, template.name)}
              style={{
                padding: '8px',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
          transform: 'scaleX(0)',
          transition: 'transform 0.5s',
          transformOrigin: 'left'
        }}
        className="bottom-gradient"
      />
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onAction, type }) => (
  <div style={{ textAlign: 'center', padding: '64px 16px' }}>
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, #6366f1, #a855f7)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        opacity: 0.2,
        animation: 'pulse 2s infinite'
      }} />
      <div style={{
        position: 'relative',
        padding: '24px',
        background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
        borderRadius: '50%'
      }}>
        <LayoutTemplate size={48} color="#4f46e5" />
      </div>
    </div>
    <h3 style={{ marginTop: '24px', fontSize: '20px', fontWeight: '600', color: '#111827' }}>
      {type === 'search' ? 'No templates found' : 'No templates yet'}
    </h3>
    <p style={{ marginTop: '8px', color: '#6b7280', maxWidth: '384px', marginLeft: 'auto', marginRight: 'auto' }}>
      {type === 'search' 
        ? 'Try adjusting your search or filters to find what you\'re looking for.'
        : 'Create your first email template to start building beautiful campaigns.'}
    </p>
    {type !== 'search' && (
      <Link to="/templates/new">
        <button style={{
          marginTop: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '12px 24px',
          background: 'linear-gradient(to right, #4f46e5, #4338ca)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '500',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #4338ca, #3730a3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #4f46e5, #4338ca)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
        }}>
          <Sparkles size={18} style={{ marginRight: '8px' }} />
          Create Your First Template
        </button>
      </Link>
    )}
  </div>
);

export default function TemplatesPage() {
  const API_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8000/api/v1" : "/api/v1";
  const navigate = useNavigate();
  
  // State
  const [templates, setTemplates] = useState([]);
  const [mailingLists, setMailingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const token = localStorage.getItem("access");

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTemplates(), fetchMailingLists()]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Search debounce
  useEffect(() => {
    if (token) {
      const delayDebounce = setTimeout(() => {
        fetchTemplates();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, token]);

  const fetchTemplates = async () => {
    try {
      let url = `${API_URL}/templates/`;
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemplates(response.data.results || response.data);
    } catch (err) {
      console.error("Error fetching templates:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access");
        navigate("/");
      }
    }
  };

  const fetchMailingLists = async () => {
    try {
      const response = await axios.get(`${API_URL}/mailing-lists/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMailingLists(response.data.results || response.data);
    } catch (err) {
      console.error("Error fetching mailing lists:", err);
    }
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  const handleDeleteTemplate = async (templateId, templateName) => {
    if (window.confirm(`Are you sure you want to delete "${templateName}"?`)) {
      try {
        await axios.delete(`${API_URL}/templates/${templateId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTemplates(templates.filter(t => t.id !== templateId));
        setMessage({ type: "success", text: `✅ Template "${templateName}" deleted successfully.` });
      } catch (err) {
        console.error("Error deleting template:", err);
        setMessage({ type: "error", text: "❌ Error deleting template." });
      }
    }
  };

  const handleDuplicateTemplate = async (template) => {
    try {
      const payload = {
        name: `${template.name} (Copy)`,
        subject: template.subject,
        content_text: template.content_text,
        content_html: template.content_html,
        mailing_list: template.mailing_list
      };

      const response = await axios.post(
        `${API_URL}/templates/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchTemplates();
      setMessage({ type: "success", text: `✅ Template duplicated as "${response.data.name}".` });
    } catch (err) {
      console.error("Error duplicating template:", err);
      setMessage({ type: "error", text: "❌ Error duplicating template." });
    }
  };

  const filteredTemplates = Array.isArray(templates) 
  ? templates.filter(template => 
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  return (
    <>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: window.innerWidth < 1024 ? 'flex-start' : 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ position: 'relative' }}>
              <h1 style={{
                fontSize: '30px',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(to right, #4f46e5, #9333ea)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Email Templates
              </h1>
              <p style={{ color: '#6b7280', marginTop: '4px' }}>Create and manage beautiful email templates</p>
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '80px',
                height: '4px',
                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                borderRadius: '2px'
              }} />
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth < 640 ? 'column' : 'row',
              alignItems: 'center',
              gap: '12px',
              width: window.innerWidth < 1024 ? '100%' : 'auto'
            }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                <div style={{
                  position: 'absolute',
                  inset: '0 0 0 0',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}>
                  <Search size={18} color="#9ca3af" />
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '10px 12px 10px 40px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    style={{
                      position: 'absolute',
                      inset: '0 0 0 auto',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={16} color="#9ca3af" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '4px',
                backgroundColor: '#ffffff'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'grid' ? '#eef2ff' : 'transparent',
                    color: viewMode === 'grid' ? '#4f46e5' : '#9ca3af',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'list' ? '#eef2ff' : 'transparent',
                    color: viewMode === 'list' ? '#4f46e5' : '#9ca3af',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="List view"
                >
                  <ListIcon size={18} />
                </button>
              </div>

              {/* New Template Button */}
              <Link to="/templates/new" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(to right, #4f46e5, #4338ca)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #4338ca, #3730a3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #4f46e5, #4338ca)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.3)';
                }}>
                  <Sparkles size={18} />
                  <span>New Template</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Cards - Now with proper grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* Total Templates Card */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', margin: 0 }}>Total Templates</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#4f46e5', marginTop: '4px' }}>{templates.length}</p>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#eef2ff',
                  borderRadius: '12px',
                  transition: 'transform 0.3s'
                }}>
                  <LayoutTemplate size={24} color="#4f46e5" />
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                <span style={{ color: '#22c55e' }}>↑ 12%</span> from last month
              </div>
            </div>
            
            {/* HTML Templates Card */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', margin: 0 }}>HTML Templates</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#9333ea', marginTop: '4px' }}>
                  {templates?.filter?.(t => t.content_html && t.content_html !== t.content_text).length || 0}
                  </p>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#faf5ff',
                  borderRadius: '12px',
                  transition: 'transform 0.3s'
                }}>
                  <Code2 size={24} color="#9333ea" />
                </div>
              </div>
            </div>
            
            {/* Mailing Lists Card */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', margin: 0 }}>Mailing Lists</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#22c55e', marginTop: '4px' }}>{mailingLists.length}</p>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  transition: 'transform 0.3s'
                }}>
                  <Users size={24} color="#22c55e" />
                </div>
              </div>
            </div>

            {/* Campaigns Card */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', margin: 0 }}>Campaigns</p>
                  <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>0</p>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fffbeb',
                  borderRadius: '12px',
                  transition: 'transform 0.3s'
                }}>
                  <Send size={24} color="#f59e0b" />
                </div>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {message.type === "success" ? (
                  <CheckCircle size={20} style={{ marginRight: '8px', color: '#22c55e' }} />
                ) : (
                  <AlertCircle size={20} style={{ marginRight: '8px', color: '#ef4444' }} />
                )}
                <span style={{ fontWeight: '500' }}>{message.text}</span>
              </div>
              <button onClick={clearMessage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={18} />
              </button>
            </div>
          )}

          {/* Templates Grid/List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <RefreshCw size={48} color="#e0e7ff" style={{ animation: 'spin 1s linear infinite' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, #6366f1, #a855f7)',
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                  opacity: 0.2,
                  animation: 'pulse 2s infinite'
                }} />
              </div>
              <p style={{ marginTop: '16px', color: '#6b7280', fontWeight: '500' }}>Loading your templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <EmptyState 
              type={searchTerm ? 'search' : 'empty'} 
              onAction={() => navigate('/templates/new')}
            />
          ) : (
            <div style={{
              display: viewMode === 'grid' 
                ? 'grid' 
                : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : 'none',
              flexDirection: viewMode === 'list' ? 'column' : 'none',
              gap: '24px'
            }}>
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={(t) => navigate(`/templates/edit/${t.id}`)}
                  onDelete={handleDeleteTemplate}
                  onDuplicate={handleDuplicateTemplate}
                  onPreview={(t) => {
                    setPreviewTemplate(t);
                    setPreviewMode(true);
                  }}
                  mailingLists={mailingLists}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && previewTemplate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '896px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, #eef2ff, #ffffff)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#eef2ff', borderRadius: '10px' }}>
                  <Eye size={20} color="#4f46e5" />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Template Preview</h2>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>{previewTemplate.name}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setPreviewMode(false);
                  setPreviewTemplate(null);
                }}
                style={{
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#eef2ff',
                borderRadius: '10px',
                border: '1px solid #c7d2fe'
              }}>
                <p style={{ fontSize: '14px', color: '#312e81', margin: 0 }}>
                  <span style={{ fontWeight: '600' }}>Subject:</span> {previewTemplate.subject}
                </p>
              </div>
              
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                padding: '24px',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
              }}>
                {previewTemplate.content_html ? (
                  <div dangerouslySetInnerHTML={{ __html: previewTemplate.content_html }} />
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', color: '#374151' }}>
                    {previewTemplate.content_text}
                  </div>
                )}
              </div>
            </div>
            
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setPreviewMode(false);
                  setPreviewTemplate(null);
                }}
                style={{
                  padding: '10px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .action-icons {
          opacity: 0;
        }
        div:hover > .action-icons {
          opacity: 1;
        }
        .bottom-gradient {
          transform: scaleX(0);
        }
        div:hover .bottom-gradient {
          transform: scaleX(1);
        }
      `}</style>
    </>
  );
}