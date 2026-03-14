import { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { 
  ListPlus, 
  Upload, 
  Users, 
  Mail, 
  Plus,
  X,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  TrendingUp,
  UserPlus,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
  LayoutDashboard,
  Settings,
  Send,
  UserCircle,
  LogOut,
  ChevronRight,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  Phone,
  AtSign,
  RefreshCw,
  Save
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


function NavLink({ to, icon, label, active = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? "bg-blue-800/30 text-white" 
          : "hover:bg-blue-800/20 text-blue-100 hover:text-white"
      }`}
      style={{ margin: "0.5rem 0" }}
    >
      <div className={active ? "text-white" : "text-blue-200 group-hover:text-white"}>
        {icon}
      </div>
      <span>{label}</span>
      <ChevronRight size={16} className={`ml-auto ${
        active ? "text-blue-300" : "text-blue-200/50 group-hover:text-blue-200"
      }`} />
    </Link>
  );
}

export default function SubscribersPage() {
  const API_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8000/api/v1" : "/api/v1";
  const navigate = useNavigate();
  
  const [mailingLists, setMailingLists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [createNewList, setCreateNewList] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("list");
  const [expandedSections, setExpandedSections] = useState({
    bulk: true,
    upload: true,
    single: true,
    list: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    phone: "",
    emails: [],
    mailing_list: []
  });

  const token = localStorage.getItem("access");

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // ✅ Dropzone setup
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, setAcceptedFiles } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    multiple: false,
  });
// ✅ Add Single Subscriber
const handleAddSubscriber = async (e) => {
  e.preventDefault();
  let listId = e.target.list?.value;
  const newListName = e.target.newList?.value;
  const full_name = e.target.full_name.value;
  const phone = e.target.phone.value;
  const emailsInput = e.target.emails.value;
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

  try {
    if (createNewList && newListName) {
      const listRes = await axios.post(
        `${API_URL}/mailing-lists/`,
        { name: newListName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      listId = listRes.data.id;
      console.log('list res:', listRes)
      console.log('list data:', listRes)
      console.log('list id:',  listId)
      setMailingLists([...mailingLists, listRes.data]);
    }
    console.log('mailing list', listId)
    // Parse emails
    const emails = emailsInput
      .split(",")
      .map(email => ({ email: email.trim() }))
      .filter(email => email.email && email.email.includes('@'));
    console.log('emails', emails)
    if (emails.length === 0) {
      setMessage({ type: "error", text: "❌ At least one valid email is required." });
      return;
    }

    // Parse phone if provided (backend expects array)
    const phones = phone.trim() 
      ? [{ phone: phone.trim().replace(/[^0-9]/g, '') }]  // Remove non-digits
      : [];
    console.log('phones', phones)
    const payload = {
      full_name,
      mailing_list: parseInt(listId),
      emails,
      phones  // ✅ Changed from 'phone' to 'phones' array
    };

    const res = await axios.post(
      `${API_URL}/subscribers/`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`payload ${payload}`);
    // Fetch updated subscribers to get full data with emails
    await fetchSubscribers();
    
    // Check response for skipped emails
    const summary = res.data.summary;
    console.log(`response: ${res.data}`);
    console.log(`summary: ${res.data.summary}`)
    let messageText = `✅ ${res.data.full_name} added successfully.`;
    if (summary) {
  // Check if skipped_emails exists and is an array
  if (summary.skipped_emails && Array.isArray(summary.skipped_emails) && summary.skipped_emails.length > 0) {
    messageText += ` Skipped emails (already exist): ${summary.skipped_emails.join(', ')}`;
  }
  // Check if added_emails exists and is an array
  if (summary.added_emails && Array.isArray(summary.added_emails) && summary.added_emails.length > 0) {
    messageText += ` Added emails: ${summary.added_emails.join(', ')}`;
  }
}
    
    setMessage({ type: "success", text: messageText });
    
    e.target.reset();
    setCreateNewList(false);
    setNewListName("");
  } catch (err) {
    console.error("Add subscriber error:", err);
    const errorMsg = err.response?.data?.emails?.[0] || 
                     err.response?.data?.error || 
                     "❌ Error adding subscriber. Please check all fields.";
    setMessage({ type: "error", text: errorMsg });
  }
};

// ✅ Edit Subscriber
const handleEditSubscriber = async (e) => {
  e.preventDefault();
  
  try {
    // Prepare phones array (backend expects array)
    const phones = editFormData.phone?.trim()
      ? [{ phone: editFormData.phone.trim().replace(/[^0-9]/g, '') }]
      : [];

    const payload = {
      full_name: editFormData.full_name,
      mailing_list: parseInt(editFormData.mailing_list),
      phones  // ✅ Changed from 'phone' to 'phones' array
    };

    // Note: To update emails, you'd need a separate endpoint
    // or include emails in the payload with full email objects

    const res = await axios.patch(
      `${API_URL}/subscribers/${editingSubscriber.id}/`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update subscribers list
    setSubscribers(subscribers.map(s => 
      s.id === editingSubscriber.id ? res.data : s
    ));
    
    setMessage({ 
      type: "success", 
      text: `✅ ${res.data.full_name} updated successfully.${
        editFormData.phone ? ' Phone updated.' : ''
      }` 
    });
    
    setShowEditModal(false);
    setEditingSubscriber(null);
  } catch (err) {
    console.error("Edit subscriber error:", err);
    setMessage({ 
      type: "error", 
      text: err.response?.data?.error || "❌ Error updating subscriber." 
    });
  }
};

// ✅ Add email to subscriber
const handleAddEmail = async (subscriberId, email) => {
  if (!email || !email.includes('@')) {
    setMessage({ type: "error", text: "❌ Please enter a valid email." });
    return;
  }

  try {
    const res = await axios.post(
      `${API_URL}/subscribers/${subscriberId}/add_email/`,
      { email: email.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    await fetchSubscribers();
    setMessage({ type: "success", text: "✅ Email added successfully." });
  } catch (err) {
    console.error("Add email error:", err);
    const errorMsg = err.response?.data?.error || 
                     err.response?.data?.email?.[0] || 
                     "❌ Error adding email. It may already exist.";
    setMessage({ type: "error", text: errorMsg });
  }
};

// ✅ Add phone to subscriber
const handleAddPhone = async (subscriberId, phone) => {
  const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
  
  if (!cleanPhone) {
    setMessage({ type: "error", text: "❌ Please enter a valid phone number." });
    return;
  }

  try {
    const res = await axios.post(
      `${API_URL}/subscribers/${subscriberId}/add_phone/`,
      { phone: cleanPhone },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    await fetchSubscribers();
    setMessage({ type: "success", text: "✅ Phone added successfully." });
  } catch (err) {
    console.error("Add phone error:", err);
    setMessage({ 
      type: "error", 
      text: err.response?.data?.error || "❌ Error adding phone." 
    });
  }
};

// ✅ Fetch subscribers + mailing lists

const fetchSubscribers = async () => {
  try {
    let url = `${API_URL}/subscribers/`;
    const params = new URLSearchParams();
    
    if (selectedListId) {
      params.append('mailing_list', selectedListId);
    }
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Ensure response.data is an array
    const subscribersData = Array.isArray(response.data) ? response.data : [];
    
    // Safely transform the data
    const processedSubscribers = subscribersData.map(sub => ({
      ...sub,
      // Ensure email_addresses is always an array
      email_addresses: Array.isArray(sub.email_addresses) 
        ? sub.email_addresses 
        : (sub.emails ? (Array.isArray(sub.emails) ? sub.emails.map(e => e.email || e) : []) : []),
      
      // Ensure phone_numbers is always an array
      phone_numbers: Array.isArray(sub.phone_numbers) 
        ? sub.phone_numbers 
        : (sub.phones ? (Array.isArray(sub.phones) ? sub.phones.map(p => p.phone || p) : []) : []),
      
      // Keep original fields for backward compatibility
      emails: Array.isArray(sub.emails) ? sub.emails : [],
      phones: Array.isArray(sub.phones) ? sub.phones : []
    }));
    
    console.log('Processed subscribers:', processedSubscribers);
    setSubscribers(processedSubscribers);
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    if (err.response?.status === 401) {
      localStorage.removeItem("access");
      navigate("/");
    }
    // Set empty array on error to prevent map issues
    setSubscribers([]);
  }
};

const fetchMailingLists = async () => {
  try {
    const response = await axios.get(`${API_URL}/mailing-lists/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('mailing list fetch response data', response.data)
    setMailingLists(response.data || []);
    if (response.data.length > 0 && !selectedListId) {
      setSelectedListId(response.data[0].id);
    }
  } catch (err) {
    console.error("Error fetching mailing lists:", err);
  }
};

// Add this helper function for phone formatting display
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

  // ✅ Add Single Subscriber
  const handleAddSubscribert = async (e) => {
    e.preventDefault();
    let listId = e.target.list?.value;
    const newListName = e.target.newList?.value;
    const full_name = e.target.full_name.value;
    const phone = e.target.phone.value;
    const emailsInput = e.target.emails.value;

    try {
      if (createNewList && newListName) {
        const listRes = await axios.post(
          `${API_URL}/mailing-lists/`,
          { name: newListName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        listId = listRes.data.id;
        setMailingLists([...mailingLists, listRes.data]);
      }

      // Parse emails
      const emails = emailsInput
        .split(",")
        .map(email => ({ email: email.trim() }))
        .filter(email => email.email);

      const payload = {
        full_name,
        mailing_list: parseInt(listId),
        emails
      };

      if (phone) {
        payload.phone = phone;
      }

      const res = await axios.post(
        `${API_URL}/subscribers/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch updated subscribers to get full data with emails
      await fetchSubscribers();
      
      setMessage({ 
        type: "success", 
        text: `✅ ${res.data.full_name} added successfully.` 
      });
      
      e.target.reset();
      setCreateNewList(false);
      setNewListName("");
    } catch (err) {
      console.error("Add subscriber error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "❌ Error adding subscriber. Please check all fields." 
      });
    }
  };

  // ✅ Edit Subscriber
  const handleEditSubscribert = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        full_name: editFormData.full_name,
        mailing_list: parseInt(editFormData.mailing_list)
      };

      if (editFormData.phone) {
        payload.phone = editFormData.phone;
      }

      const res = await axios.patch(
        `${API_URL}/subscribers/${editingSubscriber.id}/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update subscribers list
      setSubscribers(subscribers.map(s => 
        s.id === editingSubscriber.id ? res.data : s
      ));
      
      setMessage({ 
        type: "success", 
        text: `✅ ${res.data.full_name} updated successfully.` 
      });
      
      setShowEditModal(false);
      setEditingSubscriber(null);
    } catch (err) {
      console.error("Edit subscriber error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "❌ Error updating subscriber." 
      });
    }
  };

  // ✅ Add email to subscriber
  const handleAddEmailt = async (subscriberId, email) => {
    try {
      await axios.post(
        `${API_URL}/subscribers/${subscriberId}/add_email/`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchSubscribers();
      setMessage({ type: "success", text: "✅ Email added successfully." });
    } catch (err) {
      console.error("Add email error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "❌ Error adding email." 
      });
    }
  };

  // ✅ Add phone to subscriber
  const handleAddPhonet = async (subscriberId, phone) => {
    try {
      await axios.post(
        `${API_URL}/subscribers/${subscriberId}/add_phone/`,
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchSubscribers();
      setMessage({ type: "success", text: "✅ Phone added successfully." });
    } catch (err) {
      console.error("Add phone error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "❌ Error adding phone." 
      });
    }
  };

 

  const fetchMailingListst = async () => {
    try {
      const lists = await axios.get(`${API_URL}/mailing-lists/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMailingLists(lists.data);
      if (lists.data.length > 0 && !selectedListId) {
        setSelectedListId(lists.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching mailing lists:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSubscribers(), fetchMailingLists()]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, selectedListId]);

  // Search effect
  useEffect(() => {
    if (token) {
      const delayDebounce = setTimeout(() => {
        fetchSubscribers();
      }, 500);
      
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, token]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter subscribers based on search term (client-side fallback)
  const filteredSubscribers = subscribers.filter(sub => 
    sub.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.emails?.some(email => email.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sub.phones?.some(phone => phone.phone.includes(searchTerm))
  );

  // Calculate stats
  const totalSubscribers = subscribers.length;
  const totalWithPhones = subscribers.filter(sub => sub.phones?.length > 0).length;
  const totalWithMultipleEmails = subscribers.filter(sub => sub.emails?.length > 1).length;

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ["Full Name", "Phone", "Emails", "Mailing List", "Created At"].join(","),
      ...subscribers.map(sub => [
        `"${sub.full_name}"`,
        sub.phones?.[0]?.phone || "",
        `"${sub.emails?.map(e => e.email).join('; ')}"`,
        mailingLists.find(l => l.id === sub.mailing_list)?.name || "",
        new Date(sub.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    setMessage({ type: "success", text: "✅ Export completed." });
  };

  // Handle delete subscriber
  const handleDeleteSubscriber = async (subscriberId, subscriberName) => {
    if (window.confirm(`Are you sure you want to delete ${subscriberName}?`)) {
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

      try {
        await axios.delete(`${API_URL}/subscribers/${subscriberId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscribers(subscribers.filter(s => s.id !== subscriberId));
        setMessage({ type: "success", text: `✅ ${subscriberName} deleted successfully.` });
      } catch (err) {
        console.error("Delete error:", err);
        setMessage({ type: "error", text: "❌ Error deleting subscriber." });
      }
    }
  };

  // Open edit modal
  const openEditModal = (subscriber) => {
    setEditingSubscriber(subscriber);
    setEditFormData({
      full_name: subscriber.full_name,
      phone: subscriber.phones?.[0]?.phone || "",
      emails: subscriber.emails || [],
      mailing_list: subscriber.mailing_list
    });
    setShowEditModal(true);
  };

  // Clear message
  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  return (
    <>
     
      <div >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0A3A67]">Manage Subscribers</h1>
              <p className="text-gray-600 mt-1">Add and manage your email subscribers</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X size={16} className="text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>
              <button 
                onClick={handleExport}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <Download size={18} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Subscribers</p>
                  <p className="text-2xl font-bold text-[#0A3A67] mt-1">{totalSubscribers}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
                  <Users size={22} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm font-medium">With Phone Numbers</p>
                  <p className="text-2xl font-bold text-[#0A3A67] mt-1">{totalWithPhones}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 text-green-700">
                  <Phone size={22} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Mailing Lists</p>
                  <p className="text-2xl font-bold text-[#0A3A67] mt-1">{mailingLists.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
                  <Mail size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* List Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by List:</label>
              <select
                value={selectedListId || ""}
                onChange={(e) => setSelectedListId(e.target.value || null)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
             <option value="">All Lists</option>
              {(Array.isArray(mailingLists) ? mailingLists : []).map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.subscriber_count || 0})
                </option>
              ))}
            
              </select>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div 
              className={`p-4 rounded-lg mb-6 animate-fade-in border ${
                message.type === "success" 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-red-100 text-red-800 border-red-200"
              } flex justify-between items-center`}
            >
              <div className="flex items-center">
                {message.type === "success" ? (
                  <CheckCircle size={18} className="mr-2" />
                ) : (
                  <AlertCircle size={18} className="mr-2" />
                )}
                {message.text}
              </div>
              <button onClick={clearMessage} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
           <button
              className={`px-4 py-3 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                activeTab === "list" 
                  ? "text-[#0A3A67] border-b-2 border-[#0A3A67]" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("list")}
            >
              <Mail size={18} />
              <span>Subscribers List</span>
            </button>
            <button
              className={`px-4 py-3 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                activeTab === "single" 
                  ? "text-[#0A3A67] border-b-2 border-[#0A3A67]" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("single")}
            >
              <UserPlus size={18} />
              <span>Add Single</span>
            </button>
            <button
              className={`px-4 py-3 font-medium flex items-center space-x-2 whitespace-nowrap transition-colors ${
                activeTab === "bulk" 
                  ? "text-[#0A3A67] border-b-2 border-[#0A3A67]" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("bulk")}
            >
              <ListPlus size={18} />
              <span>Bulk Add</span>
            </button>
          
          </div>

          {/* Single Add Section */}
          <div className={`${activeTab === "single" ? "block" : "hidden"}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("single")}
              >
                <div>
                  <h2 className="text-xl font-semibold text-[#0A3A67]">Add Single Subscriber</h2>
                  <p className="text-sm text-gray-500 mt-1">Add one subscriber at a time</p>
                </div>
                {expandedSections.single ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedSections.single && (
                <div className="mt-6">
                  <form onSubmit={handleAddSubscriber} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          placeholder="John Doe"
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone (optional)
                        </label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="+1234567890"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email(s) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="emails"
                          placeholder="john@example.com, john.work@example.com"
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Separate multiple emails with commas. At least one email required.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mailing List <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {!createNewList ? (
                          <select
                            name="list"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                           <option value="">-- Choose Mailing List --</option>
                              {Array.isArray(mailingLists) && mailingLists.map((list) => (
                                <option key={list.id} value={list.id}>
                                  {list.name} ({list.subscriber_count || 0} subscribers)
                                </option>
                              ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            name="newList"
                            placeholder="Enter new mailing list name"
                            required
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                        
                        <button
                          type="button"
                          onClick={() => {
                            setCreateNewList(!createNewList);
                            setNewListName("");
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {createNewList ? "← Choose existing list" : "+ Create new list"}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-[#0A3A67] text-white px-6 py-3 rounded-lg shadow hover:bg-[#082B4F] transition-colors flex items-center space-x-2 font-medium"
                      >
                        <UserPlus size={18} />
                        <span>Add Subscriber</span>
                      </button>
                      <button
                        type="reset"
                        onClick={() => {
                          setCreateNewList(false);
                          setNewListName("");
                        }}
                        className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Bulk Add Section */}
          <div className={`${activeTab === "bulk" ? "block" : "hidden"}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("bulk")}
              >
                <div>
                  <h2 className="text-xl font-semibold text-[#0A3A67]">Bulk Add Subscribers</h2>
                  <p className="text-sm text-gray-500 mt-1">Add multiple subscribers at once</p>
                </div>
                {expandedSections.bulk ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedSections.bulk && (
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mailing List <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedListId || ""}
                      onChange={(e) => setSelectedListId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Choose Mailing List --</option>
                        {Array.isArray(mailingLists) && mailingLists.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.name} ({list.subscriber_count || 0} subscribers)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <div
                      {...getRootProps()}
                      className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
                        isDragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Upload size={36} className={`${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div>
                          <p className="text-gray-700 font-medium">
                            {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to browse'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Supports .csv, .xls, .xlsx files
                          </p>
                        </div>
                        {acceptedFiles.length > 0 && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800 font-medium">
                              Selected: {acceptedFiles[0].name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-medium">File Format:</p>
                      <p className="text-gray-500">CSV with columns: Full Name, Phone (optional), Email1, Email2, ...</p>
                      <p className="text-gray-500 text-xs mt-1">Example: John Doe, +1234567890, john@email.com, john.work@email.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        // TODO: Implement file upload to backend
                        setMessage({ type: "info", text: "File upload endpoint not implemented yet" });
                      }}
                      disabled={!selectedListId || acceptedFiles.length === 0 || uploading}
                      className="bg-[#0A3A67] text-white px-6 py-3 rounded-lg shadow hover:bg-[#082B4F] transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          <span>Upload File</span>
                        </>
                      )}
                    </button>
                    {acceptedFiles.length > 0 && (
                      <button
                        onClick={() => setAcceptedFiles([])}
                        className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subscribers List Section */}
          <div className={`${activeTab === "list" ? "block" : "hidden"}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection("list")}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-[#0A3A67]">All Subscribers</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {filteredSubscribers.length} subscriber{filteredSubscribers.length !== 1 ? 's' : ''}
                      {selectedListId && ` in selected list`}
                      {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                  </div>
                  {expandedSections.list ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {expandedSections.list && (
                <>
                  {loading ? (
                    <div className="text-center py-12">
                      <RefreshCw size={40} className="mx-auto mb-4 text-gray-300 animate-spin" />
                      <p className="text-gray-500">Loading subscribers...</p>
                    </div>
                  ) : filteredSubscribers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users size={48} className="mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        {searchTerm || selectedListId ? 'No subscribers found' : 'No subscribers yet'}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm || selectedListId 
                          ? 'Try adjusting your filters or add new subscribers.' 
                          : 'Add subscribers using the form above to get started.'}
                      </p>
                      {!searchTerm && !selectedListId && (
                        <button 
                          onClick={() => setActiveTab("single")}
                          className="bg-[#0A3A67] text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-[#082B4F] transition-colors mx-auto"
                        >
                          <Plus size={18} />
                          <span>Add First Subscriber</span>
                        </button>
                      )}
                    </div>
                  ) : (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Subscriber
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Contact Information
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            List
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Added
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredSubscribers.length > 0 ? (
          filteredSubscribers.map((subscriber) => {
            const list = mailingLists.find(l => l.id === subscriber.mailing_list);
            const hasEmails = subscriber.email_addresses?.length > 0;
            const hasPhones = subscriber.phone_numbers?.length > 0;
            
            return (
              <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors group">
                {/* Name with Avatar */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {subscriber.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {subscriber.full_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: #{subscriber.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact Info with improved layout */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {/* Emails */}
                 {hasEmails && (
                      <div className="space-y-1">
                        {subscriber.email_addresses.map((email, idx) => (
                          <div key={`email-${idx}`} className="flex items-center text-sm text-gray-600 group/email">
                            <div className="w-5 flex-shrink-0">
                              <Mail size={14} className="text-gray-400 group-hover/email:text-blue-500" />
                            </div>
                            <span className="truncate hover:text-clip hover:overflow-visible" title={email}>
                              {email}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Phones */}
                    {hasPhones && (
                      <div className="space-y-1">
                        {subscriber.phone_numbers.map((phone, idx) => (
                          <div key={`phone-${idx}`} className="flex items-center text-sm text-gray-600 group/phone">
                            <div className="w-5 flex-shrink-0">
                              <Phone size={14} className="text-gray-400 group-hover/phone:text-green-500" />
                            </div>
                            <span>{phone}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {!hasEmails && !hasPhones && (
                      <div className="flex items-center text-sm text-gray-400 italic">
                        <div className="w-5 flex-shrink-0">
                          <Mail size={14} className="text-gray-300" />
                        </div>
                        <span>No contact information</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Mailing List Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {list ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                      {list.name}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                      Unknown
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(subscriber.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(subscriber)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit subscriber"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSubscriber(subscriber.id, subscriber.full_name)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete subscriber"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {/* Show icons always on mobile */}
                  <div className="flex items-center justify-end space-x-2 opacity-100 sm:hidden">
                    <button
                      onClick={() => openEditModal(subscriber)}
                      className="p-2 text-blue-600 hover:text-blue-900"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSubscriber(subscriber.id, subscriber.full_name)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          // Empty state
          <tr>
            <td colSpan="5" className="px-6 py-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Users size={48} className="mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">No subscribers found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {searchTerm || selectedListId ? 'Try adjusting your filters' : 'Add your first subscriber to get started'}
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Optional: Add pagination info */}
  {filteredSubscribers.length > 0 && (
    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredSubscribers.length}</span> subscribers
        </p>
        <div className="flex space-x-2">
          {/* Add pagination buttons here if needed */}
        </div>
      </div>
    </div>
  )}
</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Subscriber Modal */}
      {showEditModal && editingSubscriber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0A3A67]">Edit Subscriber</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubscriber} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mailing List</label>
                <select
                  value={editFormData.mailing_list}
                  onChange={(e) => setEditFormData({...editFormData, mailing_list: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Mailing List --</option>
                    {Array.isArray(mailingLists) && mailingLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A3A67] text-white px-6 py-2.5 rounded-lg hover:bg-[#082B4F] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}