import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';

import { UserProvider } from './context/UserContext';
import { ProjectProvider } from './context/ProjectContext';
import { CategoryProvider } from './context/CategoryContext';
import { AchievementProvider } from './context/AchievementContext';
import { ProfileProvider } from './context/ProfileContext';
import { SkillsServicesProvider } from './context/SkillsServicesContext';

import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';
import CategoryEditor from './pages/CategoryEditor';
import AchievementEditor from './pages/AchievementEditor';
import ProfileEditor from './pages/ProfileEditor';
import SkillsServicesEditor from './pages/SkillsServicesEditor';
import SignInPage from './pages/SignInPage';
import SSOCallback from './pages/SSOCallback';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_YOUR_KEY";

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
                {/* Forcing dark mode to maintain portfolio aesthetic */}
        <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/sso-callback" element={<SSOCallback />} />

                    {/* Protected routes */}
                    <Route path="/*" element={
                      <>
                        <SignedIn>
                          <UserProvider>
                            <CategoryProvider>
                              <ProjectProvider>
                                <AchievementProvider>
                                  <ProfileProvider>
                                    <SkillsServicesProvider>
                                    <Routes>
                                      <Route path="/" element={<Dashboard />} />
                                      <Route path="/profile" element={<ProfileEditor />} />
                                      <Route path="/skills-services" element={<SkillsServicesEditor />} />
                                      <Route path="/projects/new" element={<ProjectEditor />} />
                                      <Route path="/projects/:id" element={<ProjectEditor />} />
                                      <Route path="/categories/new" element={<CategoryEditor />} />
                                      <Route path="/categories/:id" element={<CategoryEditor />} />
                                      <Route path="/achievements/new" element={<AchievementEditor />} />
                                      <Route path="/achievements/:id" element={<AchievementEditor />} />
                                      <Route path="*" element={<Navigate to="/" />} />
                                    </Routes>
                                    </SkillsServicesProvider>
                                  </ProfileProvider>
                                </AchievementProvider>
                              </ProjectProvider>
                            </CategoryProvider>
                          </UserProvider>
                        </SignedIn>
                        <SignedOut>
                          <Navigate to="/sign-in" replace />
                        </SignedOut>
                      </>
                    } />
                  </Routes>
                </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}
