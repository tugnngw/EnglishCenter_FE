# Plan: Separate Features by User Roles

## Context
The English Center FE currently implements role-based feature access using UI-level filtering where navigation items and components are shown/hidden based on the user's role (GUEST, STUDENT, MENTOR, ADMIN). The system uses role checks in components like Sidebar.tsx to filter what appears to each user.

**Current State:**
- Role-based feature separation exists at UI level
- Features are filtered based on role in Sidebar.tsx navigation
- No architectural separation (same code paths for all roles)
- Role-based styling and redirect logic throughout components

**The Request:** Separate features for each role to provide true role-based feature isolation.

## Problem Statement
Currently, the system uses UI-level filtering to control what features users can see based on their role. This means all users see the same application code, with role checks determining visibility. However, the request is to implement true feature separation where different roles have access to fundamentally different code paths, APIs, and component implementations.

## Current Implementation Analysis

### Navigation System (src/components/layout/Sidebar.tsx)
**Filtered Navigation based on role:**
- **All Roles (`GUEST`, `STUDENT`, `MENTOR`, `ADMIN`):**
  - Home (/) and Exams (/exams)
- **STUDENT Only:** My Courses (/my-learning)
- **MENTOR Only:** Mentor Grading (/mentor/grading)
- **ADMIN Only:** Admin Console (/admin)
- **STUDENT & MENTOR:** Schedule (/schedule)

### Role System Implementation

**Authentication Store (`src/stores/authStore.ts`):**
- Manages global auth state using Zustand with persistence
- Contains `role` field (type `UserRole`)
- Provides `mockLogin()` for quick role switching in demo
- `setRole()` allows instant role switching for testing (Role Switcher)

**Role Constants (`src/interfaces/auth.types.ts`):**
- Centralized role type definition
- Used consistently across the codebase

# Plan: Separate Features by User Roles

## Context
The English Center FE currently implements role-based feature access using UI-level filtering where navigation items and components are shown/hidden based on the user's role (GUEST, STUDENT, MENTOR, ADMIN). However, the requested implementation requires **true architectural separation** where different roles have access to fundamentally different code paths, APIs, and component implementations.

**Current State:**
- Role-based feature separation exists at UI level
- Features are filtered based on role in Sidebar.tsx navigation
- Same codebase and API endpoints for all roles
- Role checks only control UI visibility, not code paths

**The Request:** Implement true feature separation for each role with distinct architectural layers

## Problem Statement
The current UI-level filtering approach provides basic role-based access control but doesn't meet the requirement for true feature separation. Different roles need access to fundamentally different code paths, APIs, and component implementations rather than just having different visibility of the same codebase.

## Recommended Approach: Phase 2 - True Architectural Separation (Immediate Implementation)

### Implementation Strategy
**Timeline:** 2 weeks (accelerated schedule)

**Priority:** Navigation-first approach with immediate feature separation

### Phase 2: True Architectural Separation (Immediate Implementation)

**Implementation:**
1. **Role-Based Route Configuration**: Different route definitions per role
2. **Feature-Split Components**: Separate component implementations for each role
3. **Role-Specific Service Layer**: Distinct API services per role
4. **Bundle Splitting**: Dynamic imports based on user role at build time

### Key Architecture Changes

#### 1. Role-Based Route System
```typescript
// Enhanced src/routes/AppRoutes.tsx
const routesByRole = {
  STUDENT: [
    { path: '/my-learning', component: MyCoursesPage, feature: 'student-dashboard' },
    { path: '/schedule', component: SchedulePage, feature: 'student-schedule' },
    { path: '/study/:slug', component: StudyRoomPage, feature: 'student-study' },
    { path: '/courses/:id', component: CourseDetailPage, feature: 'student-courses' },
    { path: '/exams/:id', component: ExamRoomPage, feature: 'student-exams' },
  ],
  MENTOR: [
    { path: '/mentor/grading', component: MentorGradingPage, feature: 'mentor-grading' },
    { path: '/schedule', component: SchedulePage, feature: 'mentor-schedule' },
    { path: '/exams/:id', component: ExamRoomPage, feature: 'mentor-exams' },
    { path: '/learning-path', component: LearningPathPage, feature: 'mentor-learning-path' },
  ],
  ADMIN: [
    { path: '/admin', component: AdminDashboard, feature: 'admin-console' },
    { path: '/admin/users', component: UserManagementPage, feature: 'admin-user-management' },
    { path: '/admin/analytics', component: AnalyticsPage, feature: 'admin-analytics' },
    { path: '/admin/settings', component: SettingsPage, feature: 'admin-settings' },
  ],
  GUEST: [
    { path: '/', component: HomePage, feature: 'guest-home' },
    { path: '/exams', component: ExamsPage, feature: 'guest-exams' },
    { path: '/courses', component: CourseCatalogPage, feature: 'guest-courses' },
  ],
};
```

#### 2. Role-Specific Component Structure
```typescript
// Create dedicated feature directories per role
/src/features/student-dashboard/
  /components/     # Student-specific UI components
  /hooks/          # Student-specific React hooks
  /services/       # Student-specific API services
  /types/          # Student-specific type definitions

/src/features/mentor-workspace/
  /components/     # Mentor-specific UI components
  /hooks/          # Mentor-specific React hooks
  /services/       # Mentor-specific API services
  /types/          # Mentor-specific type definitions

/src/features/admin-console/
  /components/     # Admin-specific UI components
  /hooks/          # Admin-specific React hooks
  /services/       # Admin-specific API services
  /types/          # Admin-specific type definitions
```

#### 3. Role-Specific Service Layer
```typescript
// src/services/student.service.ts
export class StudentService {
  static async getDashboardData(): Promise<StudentDashboardData> { ... }
  static async enrollInCourse(courseId: string): Promise<EnrollmentResult> { ... }
  static async getSchedule(): Promise<ScheduleEntry[]> { ... }
}

// src/services/mentor.service.ts
export class MentorService {
  static async getGradingQueue(): Promise<GradingQueue> { ... }
  static async gradeSubmission(submissionId: string, grade: GradeData): Promise<GradeResult> { ... }
  static async getSchedule(): Promise<ScheduleEntry[]> { ... }
}

// src/services/admin.service.ts
export class AdminService {
  static async getUserManagementData(): Promise<UserManagementData> { ... }
  static async updateUserRole(userId: string, role: UserRole): Promise<UpdateResult> { ... }
  static async getSystemAnalytics(): Promise<AnalyticsData> { ... }
}
```

#### 4. Role-Based Bundle Splitting
```typescript
// vite.config.ts - Add role-based bundle splitting
export default {
  build: {
    rollupOptions: {
      input: {
        'student-dashboard': 'src/features/student-dashboard/main.tsx',
        'mentor-workspace': 'src/features/mentor-workspace/main.tsx',
        'admin-console': 'src/features/admin-console/main.tsx',
        'guest-portal': 'src/features/guest-portal/main.tsx',
      }
    }
  }
};
```

### Files to Modify (Immediate Changes)

#### Critical Files - First Priority
1. **src/routes/AppRoutes.tsx**: Complete role-based route implementation
2. **src/stores/authStore.ts**: Add role-specific auth state management
3. **src/interfaces/auth.types.ts**: Add role-specific type definitions
4. **src/components/layout/Sidebar.tsx**: Implement role-specific navigation

#### New Files to Create
1. **src/features/role-governance/:** - Core role management layer
   - `index.ts` - Role governance exports
   - `route-guard.tsx` - Role-based route protection
   - `feature-flag.ts` - Feature access control

2. **src/features/student-dashboard/:**
   - `main.tsx` - Student feature entry point
   - `components/` - Student-specific UI
   - `services/` - Student-specific API layer

3. **src/features/mentor-workspace/:**
   - `main.tsx` - Mentor feature entry point
   - `components/` - Mentor-specific UI
   - `services/` - Mentor-specific API layer

4. **src/features/admin-console/:**
   - `main.tsx` - Admin feature entry point
   - `components/` - Admin-specific UI
   - `services/` - Admin-specific API layer

### Implementation Timeline (2 Weeks)

**Week 1: Foundation**
- Day 1-2: Set up role governance layer and route protection
- Day 3-4: Implement role-based route configuration
- Day 5: Set up role-specific service layers

**Week 2: Feature Implementation**
- Day 6-7: Implement student dashboard features
- Day 8-9: Implement mentor workspace features
- Day 10-11: Implement admin console features
- Day 12-13: Integration and testing
- Day 14: Final integration and deployment preparation

### Verification Strategy

**Immediate Testing (Week 2)**
1. **Route Access Testing**: Verify role-specific route access
2. **Component Loading**: Verify role-specific components load correctly
3. **Service Layer Testing**: Verify role-specific API calls
4. **Bundle Testing**: Verify separate bundles per role
5. **Integration Testing**: Verify end-to-end user journeys

### Risk Assessment (Accelerated Timeline)

**Higher Risk Due to Timeline:**
- **Technical Debt**: Limited time for refactoring may increase technical debt
- **Testing Coverage**: Reduced time for comprehensive testing
- **Performance**: Need to ensure efficient bundle loading
- **Integration**: Complex integration of multiple independent systems

**Mitigation Strategies:**
- Prioritize critical features for first release
- Implement progressive rollout
- Focus on core functionality over comprehensive coverage
- Use existing patterns and minimize architectural changes

### Success Criteria (Week 2)

**Immediate Requirements:**
- [ ] Role-based route access control implemented
- [ ] Separate feature bundles per role created
- [ ] Role-specific service layers operational
- [ ] Basic navigation working per role
- [ ] Component loading per role functional
- [ ] End-to-end user journeys verified

### Rollback Strategy

**If Issues Arise:**
1. **Rollback to Current**: Revert to existing UI-level filtering
2. **Phased Rollback**: Keep navigation separation, revert component separation
3. **Feature Flags**: Use feature flags to gradually enable new functionality
4. **Circuit Breaker**: Implement fallback mechanisms for critical paths

### Code Quality Requirements

**Maintain Standards:**
- TypeScript strict mode compliance
- Consistent coding patterns across all role-specific features
- Comprehensive error handling and logging
- Security considerations for role-based access
- Performance optimization for bundle loading

### Next Steps

**Immediate Actions Required:**
1. **Resource Allocation**: Assign dedicated team for accelerated implementation
2. **Testing Infrastructure**: Set up automated testing for role-specific features
3. **Deployment Strategy**: Plan phased rollout of new architecture
4. **Documentation**: Create comprehensive documentation for role-specific features

## Current Status

**Decision Made:** Implementing Phase 2 - True Architectural Separation

**Timeline:** 2 weeks accelerated implementation

**Priority:** Navigation-first approach with immediate feature separation

**Scope:** Full architectural separation across all role-based features

This approach provides the requested true role-based feature separation while maintaining the 2-week timeline through focused, prioritized implementation.

## Files to Modify (Immediate Changes)

### Critical Files
- `src/interfaces/auth.types.ts` - Add feature flag types
- `src/components/layout/Sidebar.tsx` - Enhance navigation logic
- `src/routes/AppRoutes.tsx` - Add route-level role protection
- `src/stores/authStore.ts` - Add feature flag state

### Supporting Files
- `src/features/auth/` - Update auth-related components
- `src/components/layout/` - Enhance role-specific UI
- `src/interfaces/` - Add new type definitions

## Success Criteria

### Phase 1
- [ ] Feature flag system implemented and working
- [ ] Role-based navigation filtering functional
- [ ] Role-specific components load based on flags
- [ ] API role filtering operational

### Phase 2
- [ ] True architectural separation achieved
- [ ] Role-based routes implemented
- [ ] Component feature splitting complete
- [ ] Performance metrics improved

## Next Steps

1. **Clarification Needed**: Confirm if Phase 1 (enhanced UI-level) is sufficient or if full Phase 2 architectural separation is required
2. **Priority Assessment**: Determine which features should be separated immediately
3. **Resource Planning**: Allocate time and resources for implementation
4. **Testing Strategy**: Plan comprehensive testing for both phases

## Questions for User

1. **Scope**: Is the enhanced UI-level filtering (Phase 1) sufficient, or do you need full architectural separation (Phase 2)?

2. **Features**: Which specific features should be separated first? Should we start with navigation, then move to component-level separation?

3. **Timeline**: What's the preferred timeline for each phase? Can we deliver Phase 1 in 2 weeks and Phase 2 in 4 weeks?

4. **Dependencies**: Are there any existing dependencies or integrations that might affect this separation approach?

5. **Testing**: What are the specific testing requirements for role-based features? Do we need to test both success and failure scenarios for each role?

## Current Status

The analysis reveals that the system already has robust role-based access control with UI-level filtering. The next step is to clarify whether enhanced filtering or true architectural separation is needed, and to prioritize features for immediate implementation.