import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import styles from "./Dashboard.module.scss";
import { ChevronDown, ChevronRight, User, Package, Calendar, DollarSign, Clock, AlertCircle } from "lucide-react";

export default function Dashboard() {
  // Get data from context with safe fallbacks
  const context = useContext(DataContext);
  const orders = context?.Orders ?? [];
  const employees = context?.employees ?? [];

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    orders: true,
    employees: true,
    jobSheets: true
  });

  // Filter employees (exclude admin)
  const filteredEmployees = employees.filter(emp => emp.role !== 'ADMIN');

  // Calculate stats
  const activeEmployees = filteredEmployees.filter(emp => emp.status === 'ACTIVE').length;
  const totalOrders = orders.length;
  const activeOrders = orders.filter(order => order.status === 'CREATED' || order.status === 'IN_PROGRESS').length;
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
  
  // Calculate total revenue
const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmountWithGST || 0), 0);

  // Get recent orders (last 5)
  const recentOrders = orders.slice(-5).reverse();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return styles.statusCompleted;
      case 'IN_PROGRESS': return styles.statusInProgress;
      case 'CREATED': return styles.statusCreated;
      case 'ACTIVE': return styles.statusActive;
      default: return styles.statusDefault;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return styles.priorityHigh;
      case 'MEDIUM': return styles.priorityMedium;
      case 'LOW': return styles.priorityLow;
      default: return styles.priorityDefault;
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Manager Dashboard</h1>
        <p className={styles.subtitle}></p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <User size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{activeEmployees}</h3>
            <p className={styles.statLabel}>Active Employees</p>
            <span className={styles.statChange}>
              {filteredEmployees.length} Total
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Package size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{totalOrders}</h3>
            <p className={styles.statLabel}>Total Orders</p>
            <span className={styles.statChange}>
              {activeOrders} Active
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{activeOrders}</h3>
            <p className={styles.statLabel}>Active Orders</p>
            <span className={styles.statChange}>
              {completedOrders} Completed
            </span>
          </div>
        </div>

        {/* <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{formatCurrency(totalRevenue)}</h3>
            <p className={styles.statLabel}>Total Revenue</p>
            <span className={styles.statChange}>
              This Period
            </span>
          </div>
        </div> */}
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Orders List */}
        <div className={styles.section}>
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection('orders')}
          >
            <h2 className={styles.sectionTitle}>Orders List</h2>
            <div className={styles.sectionActions}>
              <span className={styles.sectionCount}>{totalOrders}</span>
              {expandedSections.orders ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
          </div>
          
          {expandedSections.orders && (
            <div className={styles.sectionContent}>
              {recentOrders.length > 0 ? (
                <div className={styles.ordersList}>
            {recentOrders.map((order) => (
  <div key={order.id} className={styles.orderCard}>
    <div className={styles.orderHeader}>
      <div className={styles.orderInfo}>
        <h4 className={styles.orderClient}>{order.media}</h4>
        <p className={styles.orderDate}>{formatDate(order.createdAtDateTime)}</p>
      </div>
      <div className={styles.orderMeta}>
        <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>{order.status}</span>
        <span className={styles.orderType}>{order.orderType}</span>
      </div>
    </div>
    <div className={styles.orderDetails}>
      <div className={styles.orderRow}>
        <span className={styles.orderLabel}>Type:</span>
        <span className={styles.orderValue}>{order.orderType}</span>
      </div>
      <div className={styles.orderRow}>
        <span className={styles.orderLabel}>Priority:</span>
        <span className={`${styles.orderPriority} ${getPriorityColor(order.priority)}`}>
          {order.priority}
        </span>
      </div>
      {/* <div className={styles.orderRow}>
        <span className={styles.orderLabel}>Amount:</span>
        <span className={styles.orderAmount}>
          {formatCurrency(order.totalAmountWithGST)}
        </span>
      </div> */}
      {/* <div className={styles.orderRow}>
        <span className={styles.orderLabel}>Size:</span>
        <span className={styles.orderValue}>
          {order.width} x {order.height} | Qty: {order.qty}
        </span>
      </div> */}
    </div>
  </div>
))}

                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Package size={48} />
                  <p>No orders found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Employee List */}
        <div className={styles.section}>
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection('employees')}
          >
            <h2 className={styles.sectionTitle}>Employee List</h2>
            <div className={styles.sectionActions}>
              <span className={styles.sectionCount}>{filteredEmployees.length}</span>
              {expandedSections.employees ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
          </div>
          
          {expandedSections.employees && (
            <div className={styles.sectionContent}>
              {filteredEmployees.length > 0 ? (
                <div className={styles.employeesList}>
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className={styles.employeeCard}>
                      <div className={styles.employeeHeader}>
                        <div className={styles.employeeInfo}>
                          <h4 className={styles.employeeName}>
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <p className={styles.employeeRole}>{employee.role}</p>
                        </div>
                        <span className={`${styles.employeeStatus} ${getStatusColor(employee.status)}`}>
                          {employee.status || 'INACTIVE'}
                        </span>
                      </div>
                      
                      <div className={styles.employeeDetails}>
                        <div className={styles.employeeRow}>
                          <span className={styles.employeeLabel}>Email:</span>
                          <span className={styles.employeeValue}>{employee.email}</span>
                        </div>
                        <div className={styles.employeeRow}>
                          <span className={styles.employeeLabel}>Phone:</span>
                          <span className={styles.employeeValue}>{employee.phone}</span>
                        </div>
                        <div className={styles.employeeRow}>
                          <span className={styles.employeeLabel}>Birth Date:</span>
                          <span className={styles.employeeValue}>{employee.birthDate}</span>
                        </div>
                        <div className={styles.employeeRow}>
                          <span className={styles.employeeLabel}>Blood Group:</span>
                          <span className={styles.employeeValue}>{employee.bloodGroup}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <User size={48} />
                  <p>No employees found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Job Sheets List */}
        <div className={styles.section}>
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection('jobSheets')}
          >
            <h2 className={styles.sectionTitle}>Job Sheets List</h2>
            <div className={styles.sectionActions}>
              <span className={styles.sectionCount}>0</span>
              {expandedSections.jobSheets ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
          </div>
          
          {expandedSections.jobSheets && (
            <div className={styles.sectionContent}>
              <div className={styles.emptyState}>
                <Calendar size={48} />
                <p>No job sheets available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}