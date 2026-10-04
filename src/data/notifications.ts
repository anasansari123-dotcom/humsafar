import { NotificationItem } from '../types';

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New Interest Received',
    body: 'Ayesha Khan has shown interest in your profile.',
    time: '10 min ago',
    type: 'interest',
    read: false,
  },
  {
    id: 'n2',
    title: 'Premium Match Nearby',
    body: '3 verified premium members joined near Mumbai.',
    time: '1h ago',
    type: 'match',
    read: false,
  },
  {
    id: 'n3',
    title: 'New Message',
    body: 'Fatima Noor sent you a message.',
    time: '3h ago',
    type: 'message',
    read: true,
  },
  {
    id: 'n4',
    title: 'Unlock Unlimited Profiles',
    body: 'Upgrade to Gold and connect without limits.',
    time: 'Yesterday',
    type: 'premium',
    read: true,
  },
  {
    id: 'n5',
    title: 'Profile Verification',
    body: 'Your photo verification is complete. MashaAllah!',
    time: '2d ago',
    type: 'system',
    read: true,
  },
  {
    id: 'n6',
    title: 'Interest Accepted',
    body: 'Hassan Rahman accepted your interest.',
    time: '3d ago',
    type: 'interest',
    read: true,
  },
];
