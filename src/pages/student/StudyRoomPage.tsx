/**
 * StudyRoomPage — Wrapper cho StudyRoomView
 * -----------------------------------------------------------
 * URL: /study/:slug?lesson=:lessonId
 */

import React from 'react';
import { StudyRoomView } from '@/features/learning';

const StudyRoomPage: React.FC = () => {
  return <StudyRoomView />;
};

export default StudyRoomPage;
