import ChangePasswordModal from './change-password-modal';
import CreateGroupModal from './create-group-modal';
import { DailyAttendanceModal } from './daily-attendance-modal';
import { OtherUserModal } from './other-user-modal';
import { PersonalModal } from './personal-modal';
import { ProfileModal } from './profile-modal';
import SendCardModal from './send-card-modal';

export default function Modals() {
  return (
    <>
      <DailyAttendanceModal />
      <PersonalModal />
      <ChangePasswordModal />
      <ProfileModal />
      <OtherUserModal />
      <CreateGroupModal />
      <SendCardModal />
    </>
  );
}
