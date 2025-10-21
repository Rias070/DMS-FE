# Role-Based Home Pages

This directory contains role-specific home pages for the DMS application.

## Pages

### 1. CompanyAdminHome.tsx
- **Role**: Company Administrator
- **Features**: 
  - Overview of all dealers
  - User management
  - Revenue tracking
  - System-wide analytics
- **Access**: Highest level access to all features

### 2. CompanyStaffHome.tsx
- **Role**: Company Staff
- **Features**:
  - Personal task management
  - Assignment tracking
  - Communication tools
  - Progress monitoring
- **Access**: Limited to assigned tasks and communications

### 3. DealerAdminHome.tsx
- **Role**: Dealer Administrator
- **Features**:
  - Dealer-specific management
  - Staff oversight
  - Performance tracking
  - Local analytics
- **Access**: Management of assigned dealers and staff

### 4. DealerStaffHome.tsx
- **Role**: Dealer Staff
- **Features**:
  - Task assignments
  - Customer interactions
  - Progress reporting
  - Communication tools
- **Access**: Limited to assigned tasks and customer interactions

### 5. RoleBasedHome.tsx
- **Purpose**: Router component that determines which home page to show based on user role
- **Logic**:
  1. Checks for CompanyAdmin role first (highest priority)
  2. Checks for DealerAdmin role second
  3. Checks for Staff roles (CompanyStaff or DealerStaff)
  4. Falls back to default dashboard if role not recognized

## Role Priority

The system follows this priority order:
1. **CompanyAdmin** - Highest priority
2. **DealerAdmin** - Second priority  
3. **Staff roles** - CompanyStaff or DealerStaff
4. **Fallback** - Default dashboard

## Integration

- **App.tsx**: Routes to `RoleBasedHome` as the main dashboard
- **AuthContext**: Provides user role information
- **useRole hook**: Provides convenient role checking methods
- **Notification system**: Shows welcome messages based on role
- **Header**: Displays current role indicator

## Usage

The system automatically:
1. Detects user role after login
2. Routes to appropriate home page
3. Shows role-specific content and features
4. Displays role indicator in header
5. Shows welcome notification with role information
