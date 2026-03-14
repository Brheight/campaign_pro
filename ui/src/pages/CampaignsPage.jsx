import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Send,
  Mail,
  Users,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Copy,
  Calendar,
  BarChart3,
  ChevronRight,
  Sparkles,
  FileText,
  Code,
  Plus,
  X,
  Zap,
  Globe,
  Power,
  PowerOff,
  Settings as SettingsIcon,
  LayoutTemplate,
  Inbox,
  TrendingUp,
  AlertTriangle,
  CheckCheck,
  Phone,
  AtSign,
  Filter,
  Search,
  Download,
  Upload,
  Save,
  Edit3,
  Trash2,
  MoreVertical,
  Play,
  Pause,
  StopCircle,
  Loader,
  CheckCircle2,
  XOctagon,
  HelpCircle,
  BookOpen,
  Rocket,
  Target,
  PenTool,
  MailCheck,
  MailWarning,
  Award,
  Flag,
  Gauge,
  Timer
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// NavLink Component
function NavLink({ to, icon, label, active = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? "bg-indigo-800/30 text-white" 
          : "hover:bg-indigo-800/20 text-indigo-100 hover:text-white"
      }`}
      style={{ margin: "0.5rem 0" }}
    >
      <div className={active ? "text-white" : "text-indigo-200 group-hover:text-white"}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      <ChevronRight size={16} className={`ml-auto ${
        active ? "text-indigo-300" : "text-indigo-200/50 group-hover:text-indigo-200"
      }`} />
    </Link>
  );
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div style={{
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #f3f4f6',
    transition: 'all 0.3s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.transform = 'translateY(0)';
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <div style={{
        padding: '10px',
        backgroundColor: color + '20',
        borderRadius: '10px'
      }}>
        <Icon size={22} color={color} />
      </div>
      {trend && (
        <span style={{
          padding: '4px 8px',
          backgroundColor: trend > 0 ? '#dcfce7' : '#fee2e2',
          color: trend > 0 ? '#166534' : '#991b1b',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{value}</h3>
    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{label}</p>
  </div>
);

// Milestone Progress Component
const MilestoneProgress = ({ profile }) => {
  console.log('profile for milestone');
  console.log('profile', profile);
  if (!profile) return null;

  const progress = profile.progress_to_next_milestone || {};
  const percentage = progress.percentage || 0;
  const remaining = progress.remaining || 0;
  const target = progress.target || 'Unlimited';

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          padding: '8px',
          backgroundColor: '#fef3c7',
          borderRadius: '10px'
        }}>
          <Award size={20} color="#d97706" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Sending Milestone Progress
          </h4>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {profile.total_sent_all_time} / {target} emails sent
          </p>
        </div>
      </div>

      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '8px'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: 'linear-gradient(to right, #4f46e5, #8b5cf6)',
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
        <span>Current Tier: <strong style={{ color: '#4f46e5' }}>{profile.current_tier}</strong></span>
        <span>Daily Limit: <strong>{profile.daily_limit}</strong></span>
        <span>Remaining Today: <strong>{profile.remaining_today}</strong></span>
      </div>

      {remaining > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Flag size={14} />
          Send {remaining} more emails to unlock next tier!
        </div>
      )}
    </div>
  );
};

// Campaign Card Component
const CampaignCard = ({ campaign, onSend, onPrepare, onPause, onResume, onEdit, onDelete, onDuplicate, onViewStats, sendingCampaign }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'sent': return { bg: '#dcfce7', text: '#166534', icon: CheckCircle };
      case 'scheduled': return { bg: '#fef9c3', text: '#854d0e', icon: Clock };
      case 'sending': return { bg: '#dbeafe', text: '#1e40af', icon: Send };
      case 'paused': return { bg: '#fff7ed', text: '#9a3412', icon: Pause };
      case 'draft': return { bg: '#f3f4f6', text: '#4b5563', icon: FileText };
      case 'failed': return { bg: '#fee2e2', text: '#991b1b', icon: XCircle };
      default: return { bg: '#f3f4f6', text: '#6b7280', icon: FileText };
    }
  };

  const status = getStatusColor(campaign.status || 'draft');
  const StatusIcon = status.icon;
  const isSending = sendingCampaign === campaign.id;
  const progress = campaign.progress_percentage || 0;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      transition: 'all 0.3s',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.borderColor = '#c7d2fe';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = '#e5e7eb';
    }}>
      {isSending && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(to right, #4f46e5, #818cf8)',
          animation: 'loading 1.5s infinite'
        }} />
      )}
      
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '12px'
            }}>
              <Mail size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                {campaign.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                {campaign.subject || 'No subject'}
              </p>
            </div>
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: status.bg,
            color: status.text
          }}>
            <StatusIcon size={12} style={{ marginRight: '4px' }} />
            {campaign.status || 'Draft'}
          </span>
        </div>

        {/* Progress Bar for Sending/Paused campaigns */}
        {(campaign.status === 'sending' || campaign.status === 'paused') && campaign.total_recipients > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: '#6b7280' }}>Progress</span>
              <span style={{ fontWeight: '500', color: '#4f46e5' }}>{progress}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#f3f4f6',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(to right, #4f46e5, #818cf8)',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        )}

        {/* Details */}
        <div style={{ marginBottom: '16px' }}>
          {campaign.mailing_list_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Users size={14} color="#9ca3af" />
              <span style={{ fontSize: '13px', color: '#4b5563' }}>
                List: <span style={{ fontWeight: '500' }}>{campaign.mailing_list_name}</span>
              </span>
            </div>
          )}
          {campaign.template_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <LayoutTemplate size={14} color="#9ca3af" />
              <span style={{ fontSize: '13px', color: '#4b5563' }}>
                Template: <span style={{ fontWeight: '500' }}>{campaign.template_name}</span>
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#9ca3af" />
            <span style={{ fontSize: '13px', color: '#4b5563' }}>
              Created: {new Date(campaign.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats */}
        {campaign.stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {campaign.stats.sent_count || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Sent</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                {campaign.total_recipients || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Total</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: campaign.remaining_recipients > 0 ? '#2563eb' : '#9ca3af' }}>
                {campaign.remaining_recipients || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Remaining</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {campaign.status === 'draft' && campaign.total_recipients === 0 && (
            <button
              onClick={() => onPrepare(campaign)}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Target size={14} />
              Prepare
            </button>
          )}

          {(campaign.status === 'draft' || campaign.status === 'paused') && campaign.total_recipients > 0 && (
            <button
              onClick={() => onSend(campaign)}
              disabled={isSending || !campaign.can_send}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: !campaign.can_send ? '#9ca3af' : 'linear-gradient(to right, #4f46e5, #4338ca)',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: !campaign.can_send ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: !campaign.can_send ? 0.7 : 1
              }}
              title={campaign.can_send_message}
            >
              {isSending ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Sending...
                </>
              ) : campaign.status === 'paused' ? (
                <>
                  <Play size={14} />
                  Resume
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send Batch
                </>
              )}
            </button>
          )}

          {campaign.status === 'sending' && (
            <button
              onClick={() => onPause(campaign)}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: '#f59e0b',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Pause size={14} />
              Pause
            </button>
          )}

          <button
            onClick={() => onViewStats(campaign)}
            style={{
              padding: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              borderRadius: '8px',
              color: '#2563eb',
              cursor: 'pointer'
            }}
            title="View Stats"
          >
            <BarChart3 size={14} />
          </button>

          <button
            onClick={() => onEdit(campaign)}
            style={{
              padding: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              borderRadius: '8px',
              color: '#6b7280',
              cursor: 'pointer'
            }}
            title="Edit"
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={() => onDuplicate(campaign)}
            style={{
              padding: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              borderRadius: '8px',
              color: '#6b7280',
              cursor: 'pointer'
            }}
            title="Duplicate"
          >
            <Copy size={14} />
          </button>

          <button
            onClick={() => onDelete(campaign)}
            style={{
              padding: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              borderRadius: '8px',
              color: '#ef4444',
              cursor: 'pointer'
            }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Warning for sending limits */}
        {campaign.can_send === false && campaign.status !== 'sent' && campaign.total_recipients > 0 && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#fef9c3',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#854d0e',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertTriangle size={14} />
            {campaign.can_send_message}
          </div>
        )}
      </div>
    </div>
  );
};

// Batch Size Selector Component
const BatchSizeSelector = ({ currentSize, onSelect, availableSizes }) => {
  return (
    <select
      value={currentSize}
      onChange={(e) => onSelect(parseInt(e.target.value))}
      style={{
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '13px',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        outline: 'none'
      }}
    >
      {availableSizes.map(size => (
        <option key={size} value={size}>Send {size} emails</option>
      ))}
    </select>
  );
};

// Main Campaign Page Component
export default function CampaignPage() {
  const API_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8000/api/v1" : "/api/v1";
  const navigate = useNavigate();

  // State
  const [campaigns, setCampaigns] = useState([]);
  const [mailingLists, setMailingLists] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [sendingCampaign, setSendingCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [fetchError, setFetchError] = useState(null);
  const [batchSize, setBatchSize] = useState(50);
  const [showSendModal, setShowSendModal] = useState(false);
  const [campaignToSend, setCampaignToSend] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    scheduled: 0,
    drafts: 0,
    sending: 0,
    openRate: 0,
    clickRate: 0
  });

  // New campaign form state
  const [campaignForm, setCampaignForm] = useState({
    title: "",
    mailing_list: "",
    template: "",
    subject: "",
    content: "",
    schedule_date: "",
    schedule_time: "",
    batch_size: 50,
    is_controlled_sending: true
  });

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("newname") || "User";
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
      setFetchError(null);
      try {
        console.log("Fetching data with token:", token);
        
        // Fetch all data in parallel
        const [campaignsRes, listsRes, templatesRes, configsRes, profileRes] = await Promise.allSettled([
          axios.get(`${API_URL}/campaigns/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/mailing-lists/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/templates/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/email-configurations/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/sending-profile/me/`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        // Handle campaigns
        if (campaignsRes.status === 'fulfilled') {
          console.log("Campaigns fetched:", campaignsRes.value.data);
          setCampaigns(Array.isArray(campaignsRes.value.data) ? campaignsRes.value.data : []);
        } else {
          console.error("Error fetching campaigns:", campaignsRes.reason);
          setCampaigns([]);
        }

        // Handle mailing lists
        if (listsRes.status === 'fulfilled') {
          setMailingLists(Array.isArray(listsRes.value.data) ? listsRes.value.data : []);
        } else {
          setMailingLists([]);
        }

        // Handle templates
        if (templatesRes.status === 'fulfilled') {
          setTemplates(Array.isArray(templatesRes.value.data) ? templatesRes.value.data : []);
        } else {
          setTemplates([]);
        }

        // Handle email configs
        if (configsRes.status === 'fulfilled') {
          const configData = configsRes.value.data;
          setEmailConfigs(Array.isArray(configData) ? configData : [configData].filter(Boolean));
        } else {
          setEmailConfigs([]);
        }

        // Handle user profile
        if (profileRes.status === 'fulfilled') {
          setUserProfile(profileRes.value.data);
        } else {
          console.error("Error fetching user profile:", profileRes.reason);
        }

      } catch (err) {
        console.error("Error in fetchData:", err);
        setFetchError("Failed to load some data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, API_URL]);

  // Search debounce
  useEffect(() => {
    if (token) {
      const delayDebounce = setTimeout(() => {
        fetchCampaigns();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, filterStatus]);

  // Calculate stats
  useEffect(() => {
    const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
    const total = campaignsArray.length;
    const sent = campaignsArray.filter(c => c.status === 'sent').length;
    const scheduled = campaignsArray.filter(c => c.status === 'scheduled').length;
    const sending = campaignsArray.filter(c => c.status === 'sending').length;
    const drafts = campaignsArray.filter(c => c.status === 'draft' || !c.status).length;
    
    // Calculate average rates
    const totalSent = campaignsArray.reduce((acc, c) => acc + (c.stats?.sent_count || 0), 0);
    const openRate = 24; // Mock data
    
    setStats({
      total,
      sent,
      scheduled,
      sending,
      drafts,
      openRate,
      clickRate: 12 // Mock data
    });
  }, [campaigns]);

  // API Calls
  const fetchCampaigns = async () => {
    try {
      let url = `${API_URL}/campaigns/`;
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(res.data);
      
      // Also refresh user profile to get updated limits
      const profileRes = await axios.get(`${API_URL}/sending-profile/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(profileRes.data);
      
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setCampaignForm(prev => ({
        ...prev,
        template: templateId,
        subject: template.subject,
        content: template.content_html || template.content_text
      }));
    }
  };

  // Handle prepare campaign
  const handlePrepareCampaign = async (campaign) => {
    setSendingCampaign(campaign.id);
    try {
      const res = await axios.post(
        `${API_URL}/campaigns/${campaign.id}/prepare/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ 
        type: "success", 
        text: `✅ Campaign prepared with ${res.data.total_recipients} recipients` 
      });
      
      fetchCampaigns();
    } catch (err) {
      console.error("Error preparing campaign:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "❌ Error preparing campaign" 
      });
    } finally {
      setSendingCampaign(null);
    }
  };

  // Handle send campaign modal
  const handleSendClick = (campaign) => {
    setCampaignToSend(campaign);
    setShowSendModal(true);
  };

  // Handle send batch
  const handleSendBatch = async () => {
    if (!campaignToSend) return;

    setSendingCampaign(campaignToSend.id);
    setShowSendModal(false);

    try {
      console.log('handle send batch ')
      const res = await axios.post(
        `${API_URL}/campaigns/${campaignToSend.id}/send/`,
        {
          action: 'send_batch',
          batch_size: batchSize
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ 
        type: "success", 
        text: `✅ Sent ${res.data.sent_count} emails successfully` 
      });
      
      // Check for milestone achievement
      if (res.data.milestone_achieved) {
        setMessage({ 
          type: "success", 
          text: `🎉 Congratulations! Your daily limit has been increased to ${res.data.new_limit} emails!` 
        });
      }
      
      fetchCampaigns();
    } catch (err) {
      console.error("Error sending campaign:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "❌ Error sending campaign" 
      });
    } finally {
      setSendingCampaign(null);
      setCampaignToSend(null);
    }
  };

  // Handle pause campaign
  const handlePauseCampaign = async (campaign) => {
    setSendingCampaign(campaign.id);
    try {
      await axios.post(
        `${API_URL}/campaigns/${campaign.id}/send/`,
        { action: 'pause' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: `⏸️ Campaign paused` });
      fetchCampaigns();
    } catch (err) {
      console.error("Error pausing campaign:", err);
      setMessage({ type: "error", text: "❌ Error pausing campaign" });
    } finally {
      setSendingCampaign(null);
    }
  };

  // Handle resume campaign
  const handleResumeCampaign = async (campaign) => {
    setSendingCampaign(campaign.id);
    try {
      await axios.post(
        `${API_URL}/campaigns/${campaign.id}/send/`,
        { action: 'resume' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: `▶️ Campaign resumed` });
      fetchCampaigns();
    } catch (err) {
      console.error("Error resuming campaign:", err);
      setMessage({ type: "error", text: "❌ Error resuming campaign" });
    } finally {
      setSendingCampaign(null);
    }
  };

  // Handle view stats
  const handleViewStats = (campaign) => {
    navigate(`/campaigns/${campaign.id}/stats`);
  };

  // Handle create campaign
  const handleCreateCampaignold = async (e) => {
    e.preventDefault();
    
    try {
      if (!campaignForm.title) {
        setMessage({ type: "error", text: "Campaign title is required" });
        return;
      }

      if (!campaignForm.mailing_list) {
        setMessage({ type: "error", text: "Please select a mailing list" });
        return;
      }

      const payload = {
        title: campaignForm.title,
        mailing_list: parseInt(campaignForm.mailing_list),
        template: campaignForm.template ? parseInt(campaignForm.template) : null,
        subject: campaignForm.subject,
        content: campaignForm.content,
        batch_size: campaignForm.batch_size,
        is_controlled_sending: true,
        status: 'draft'
      };

      if (campaignForm.schedule_date && campaignForm.schedule_time) {
        payload.scheduled_for = `${campaignForm.schedule_date}T${campaignForm.schedule_time}`;
        payload.status = 'scheduled';
      }

      const res = await axios.post(
        `${API_URL}/campaigns/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: `✅ Campaign "${res.data.title}" created successfully` });
      setShowNewCampaignModal(false);
      resetForm();
      fetchCampaigns();
    } catch (err) {
      console.error("Error creating campaign:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || err.response?.data?.detail || "❌ Error creating campaign" 
      });
    }
  };
// Handle create campaign
const handleCreateCampaign = async (e) => {
  e.preventDefault();
  
  try {
    if (!campaignForm.title) {
      setMessage({ type: "error", text: "Campaign title is required" });
      return;
    }

    if (!campaignForm.mailing_list) {
      setMessage({ type: "error", text: "Please select a mailing list" });
      return;
    }

    // Build payload
    const payload = {
      title: campaignForm.title,
      mailing_list: parseInt(campaignForm.mailing_list),
      subject: campaignForm.subject || "",
      content: campaignForm.content || "",
      batch_size: campaignForm.batch_size || 50,
      is_controlled_sending: true,
      status: 'draft'
    };

    if (campaignForm.template) {
      payload.template = parseInt(campaignForm.template);
    }

    if (campaignForm.schedule_date && campaignForm.schedule_time) {
      payload.scheduled_for = `${campaignForm.schedule_date}T${campaignForm.schedule_time}`;
      payload.status = 'scheduled';
    }

    console.log("Sending payload:", payload);

    const res = await axios.post(
      `${API_URL}/campaigns/`,
      payload,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    console.log("Success response:", res.data);
    setMessage({ type: "success", text: `✅ Campaign "${res.data.title}" created successfully` });
    setShowNewCampaignModal(false);
    resetForm();
    fetchCampaigns();
  } catch (err) {
    console.error("Error creating campaign:", err);
    
    // Log the full error response
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error headers:", err.response.headers);
      console.log("Error data:", err.response.data); // THIS IS WHAT WE NEED
      
      // Show the error message
      if (err.response.data) {
        // Handle different error formats
        if (typeof err.response.data === 'object') {
          // Django REST framework usually returns field-specific errors
          const errorMessages = Object.entries(err.response.data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('; ');
          setMessage({ type: "error", text: errorMessages });
        } else {
          setMessage({ type: "error", text: err.response.data });
        }
      } else {
        setMessage({ type: "error", text: "❌ Error creating campaign" });
      }
    } else if (err.request) {
      console.log("No response received:", err.request);
      setMessage({ type: "error", text: "❌ No response from server" });
    } else {
      console.log("Error setting up request:", err.message);
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  }
};
  // Handle delete campaign
  const handleDeleteCampaign = async (campaign) => {
    if (!window.confirm(`Are you sure you want to delete "${campaign.title}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/campaigns/${campaign.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: "success", text: `✅ Campaign "${campaign.title}" deleted` });
      fetchCampaigns();
    } catch (err) {
      console.error("Error deleting campaign:", err);
      setMessage({ type: "error", text: "❌ Error deleting campaign" });
    }
  };

  // Handle duplicate campaign
  const handleDuplicateCampaign = async (campaign) => {
    try {
      const res = await axios.post(
        `${API_URL}/campaigns/${campaign.id}/duplicate/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: `✅ Campaign duplicated as "${res.data.title}"` });
      fetchCampaigns();
    } catch (err) {
      console.error("Error duplicating campaign:", err);
      setMessage({ type: "error", text: "❌ Error duplicating campaign" });
    }
  };

  // Reset form
  const resetForm = () => {
    setCampaignForm({
      title: "",
      mailing_list: "",
      template: "",
      subject: "",
      content: "",
      schedule_date: "",
      schedule_time: "",
      batch_size: 50,
      is_controlled_sending: true
    });
  };

  // Filter campaigns
  const filteredCampaigns = Array.isArray(campaigns) ? campaigns.filter(campaign => {
    if (filterStatus !== 'all' && campaign.status !== filterStatus) {
      return false;
    }
    if (searchTerm) {
      return campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             campaign.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  }) : [];

  // Check email config status
  const hasEmailConfig = emailConfigs && emailConfigs.length > 0;
  const activeConfig = hasEmailConfig ? emailConfigs.find(c => c.is_active === true) : null;
  const hasActiveConfig = !!activeConfig;

  // Get provider display name
  const getProviderName = (provider) => {
    switch(provider) {
      case 'sendgrid': return 'SendGrid';
      case 'amazonses': return 'Amazon SES';
      case 'brevo': return 'Brevo';
      default: return provider;
    }
  };

  return (
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
          <div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Campaigns
            </h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              Welcome back, {username}! Create and manage your email campaigns
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Email Config Status */}
            <Link to="/email-configs" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                backgroundColor: hasActiveConfig ? '#f0fdf4' : (hasEmailConfig ? '#fef9c3' : '#fef2f2'),
                border: `1px solid ${hasActiveConfig ? '#bbf7d0' : (hasEmailConfig ? '#fde047' : '#fecaca')}`,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {hasActiveConfig ? (
                  <>
                    <div style={{
                      padding: '6px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '8px'
                    }}>
                      <MailCheck size={18} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#166534' }}>
                        Email Active
                      </div>
                      <div style={{ fontSize: '11px', color: '#166534', opacity: 0.8 }}>
                        {getProviderName(activeConfig?.provider)}
                      </div>
                    </div>
                  </>
                ) : hasEmailConfig ? (
                  <>
                    <div style={{
                      padding: '6px',
                      backgroundColor: '#fef9c3',
                      borderRadius: '8px'
                    }}>
                      <MailWarning size={18} color="#854d0e" />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#854d0e' }}>
                        No Active Config
                      </div>
                      <div style={{ fontSize: '11px', color: '#854d0e', opacity: 0.8 }}>
                        {emailConfigs.length} config(s) available
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      padding: '6px',
                      backgroundColor: '#fee2e2',
                      borderRadius: '8px'
                    }}>
                      <XCircle size={18} color="#dc2626" />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#991b1b' }}>
                        No Email Config
                      </div>
                      <div style={{ fontSize: '11px', color: '#991b1b', opacity: 0.8 }}>
                        Click to setup
                      </div>
                    </div>
                  </>
                )}
                <ChevronRight size={16} color={hasActiveConfig ? '#16a34a' : (hasEmailConfig ? '#854d0e' : '#991b1b')} />
              </div>
            </Link>

            {/* New Campaign Button */}
            <button
              onClick={() => setShowNewCampaignModal(true)}
              disabled={!hasEmailConfig}
              style={{
                background: !hasEmailConfig ? '#9ca3af' : 'linear-gradient(to right, #4f46e5, #4338ca)',
                color: '#ffffff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: !hasEmailConfig ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !hasEmailConfig ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
              title={!hasEmailConfig ? "Please configure email settings first" : "Create new campaign"}
            >
              <Rocket size={18} />
              New Campaign
            </button>
          </div>
        </div>

        {/* User Sending Profile */}
        {userProfile && <MilestoneProgress profile={userProfile} />}

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <StatCard icon={Mail} label="Total Campaigns" value={stats.total} color="#4f46e5" />
          <StatCard icon={Send} label="Sent" value={stats.sent} color="#059669" />
          <StatCard icon={Clock} label="Scheduled" value={stats.scheduled} color="#d97706" />
          <StatCard icon={Zap} label="Sending" value={stats.sending} color="#2563eb" />
          <StatCard icon={FileText} label="Drafts" value={stats.drafts} color="#6b7280" />
        </div>

        {/* Filters and Search */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: '16px',
          marginBottom: '24px',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Campaigns</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="paused">Paused</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div style={{ position: 'relative', minWidth: '300px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4f46e5';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

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
            alignItems: 'center',
            animation: 'slideDown 0.3s ease-out'
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

        {/* Fetch Error Display */}
        {fetchError && (
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            marginBottom: '24px',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={20} color="#ef4444" />
            <span style={{ fontWeight: '500' }}>{fetchError}</span>
          </div>
        )}

        {/* Campaigns Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite', color: '#cbd5e1' }} />
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <Target size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              No campaigns found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              {searchTerm ? 'Try adjusting your search' : 'Create your first campaign to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowNewCampaignModal(true)}
                disabled={!hasEmailConfig}
                style={{
                  padding: '12px 24px',
                  background: !hasEmailConfig ? '#9ca3af' : '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '500',
                  cursor: !hasEmailConfig ? 'not-allowed' : 'pointer',
                  opacity: !hasEmailConfig ? 0.7 : 1
                }}
              >
                Create Campaign
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '20px'
          }}>
            {filteredCampaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onSend={handleSendClick}
                onPrepare={handlePrepareCampaign}
                onPause={handlePauseCampaign}
                onResume={handleResumeCampaign}
                onEdit={(c) => navigate(`/campaigns/${c.id}/edit`)}
                onDelete={handleDeleteCampaign}
                onDuplicate={handleDuplicateCampaign}
                onViewStats={handleViewStats}
                sendingCampaign={sendingCampaign}
              />
            ))}
          </div>
        )}

        {/* Send Campaign Modal */}
        {showSendModal && campaignToSend && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '10px'
                  }}>
                    <Send size={20} color="#0369a1" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                      Send Campaign
                    </h2>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                      {campaignToSend.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setCampaignToSend(null);
                  }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Select Batch Size
                  </label>
                  <BatchSizeSelector
                    currentSize={batchSize}
                    onSelect={setBatchSize}
                    availableSizes={campaignToSend.batch_size_choices || [10, 25, 50, 100]}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    You have {userProfile?.remaining_today || 50} emails remaining today
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    Campaign Summary
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Recipients:</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                      {campaignToSend.total_recipients || 0}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Remaining:</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: campaignToSend.remaining_recipients > 0 ? '#059669' : '#6b7280' }}>
                      {campaignToSend.remaining_recipients || 0}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Already Sent:</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5' }}>
                      {campaignToSend.sent_count || 0}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => {
                      setShowSendModal(false);
                      setCampaignToSend(null);
                    }}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendBatch}
                    style={{
                      padding: '10px 24px',
                      border: 'none',
                      background: 'linear-gradient(to right, #4f46e5, #4338ca)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={16} />
                    Send Batch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Campaign Modal - Keep existing but add batch size field */}
        {showNewCampaignModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(to right, #f9fafb, #ffffff)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    padding: '8px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    borderRadius: '10px'
                  }}>
                    <Rocket size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                      Create New Campaign
                    </h2>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                      Set up your email campaign
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowNewCampaignModal(false);
                    resetForm();
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
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px', overflowY: 'auto' }}>
                <form onSubmit={handleCreateCampaign}>
                  {/* Basic Info */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Basic Information
                    </h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                          Campaign Title <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={campaignForm.title}
                          onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                          placeholder="e.g., March Newsletter, Welcome Series"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
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

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                          Mailing List <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          value={campaignForm.mailing_list}
                          onChange={(e) => setCampaignForm({...campaignForm, mailing_list: e.target.value})}
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Select a mailing list</option>
                          {mailingLists.map(list => (
                            <option key={list.id} value={list.id}>
                              {list.name} ({list.subscriber_count || 0} subscribers)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Batch Size */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Sending Settings
                    </h3>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                        Default Batch Size
                      </label>
                     <select
  value={campaignForm.batch_size}
  onChange={(e) => setCampaignForm({...campaignForm, batch_size: parseInt(e.target.value)})}
  style={{
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  }}
>
  <option value={10}>10 emails per batch</option>
  <option value={25}>25 emails per batch</option>
  <option value={50}>50 emails per batch</option>
  <option 
    value={100} 
    disabled={100 > (userProfile?.daily_limit || 50)}
    style={{ color: 100 > (userProfile?.daily_limit || 50) ? '#9ca3af' : 'inherit' }}
  >
    100 emails per batch {100 > (userProfile?.daily_limit || 50) ? '(Locked)' : ''}
  </option>
  <option 
    value={200} 
    disabled={200 > (userProfile?.daily_limit || 50)}
    style={{ color: 200 > (userProfile?.daily_limit || 50) ? '#9ca3af' : 'inherit' }}
  >
    200 emails per batch {200 > (userProfile?.daily_limit || 50) ? '(Locked)' : ''}
  </option>
</select>
<p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
  Your daily limit: {userProfile?.daily_limit || 50} emails
  {userProfile?.next_milestone && (
    <span style={{ display: 'block', marginTop: '4px', color: '#4f46e5' }}>
      🎯 Send {userProfile.next_milestone - userProfile.total_sent_all_time} more emails to unlock higher limits
    </span>
  )}
</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        This can be changed when sending
                      </p>
                    </div>
                  </div>

                  {/* Template Selection */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Template (Optional)
                    </h3>
                    <select
                      value={campaignForm.template}
                      onChange={(e) => handleTemplateSelect(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        marginBottom: '12px'
                      }}
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>

                    {campaignForm.template && (
                      <div style={{
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>
                          <strong>Subject:</strong> {campaignForm.subject}
                        </p>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                          <strong>Preview:</strong> {campaignForm.content?.substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Custom Content */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Custom Content
                    </h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                          Email Subject
                        </label>
                        <input
                          type="text"
                          value={campaignForm.subject}
                          onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                          placeholder="Enter email subject"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                          Email Content
                        </label>
                        <textarea
                          value={campaignForm.content}
                          onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
                          rows={6}
                          placeholder="Write your email content here..."
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'monospace'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Schedule (Optional)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                          Date
                        </label>
                        <input
                          type="date"
                          value={campaignForm.schedule_date}
                          onChange={(e) => setCampaignForm({...campaignForm, schedule_date: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                          Time
                        </label>
                        <input
                          type="time"
                          value={campaignForm.schedule_time}
                          onChange={(e) => setCampaignForm({...campaignForm, schedule_time: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Config Status */}
                  {!hasEmailConfig && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fee2e2',
                      borderRadius: '8px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertTriangle size={16} color="#dc2626" />
                      <span style={{ fontSize: '13px', color: '#991b1b' }}>
                        No email configuration found. Please set up email settings first.
                      </span>
                      <Link to="/email-settings" style={{ marginLeft: 'auto' }}>
                        <button style={{
                          padding: '4px 12px',
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          Configure
                        </button>
                      </Link>
                    </div>
                  )}

                  {hasEmailConfig && !hasActiveConfig && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#fef9c3',
                      border: '1px solid #fde047',
                      borderRadius: '8px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertTriangle size={16} color="#854d0e" />
                      <span style={{ fontSize: '13px', color: '#854d0e' }}>
                        No active email configuration. The system will use the first available config.
                      </span>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCampaignModal(false);
                        resetForm();
                      }}
                      style={{
                        padding: '10px 20px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!hasEmailConfig}
                      style={{
                        padding: '10px 24px',
                        border: 'none',
                        background: !hasEmailConfig ? '#9ca3af' : 'linear-gradient(to right, #4f46e5, #4338ca)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: !hasEmailConfig ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: !hasEmailConfig ? 0.7 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      <Save size={16} />
                      Create Campaign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}