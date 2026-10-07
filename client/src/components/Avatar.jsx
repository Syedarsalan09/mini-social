const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#ec4899,#f43f5e)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
];

const pick = (name = '?') => {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return gradients[sum % gradients.length];
};

export default function Avatar({ user, size = 40 }) {
  const style = { width: size, height: size, fontSize: size / 2.3 };
  if (user?.avatar) {
    return <img className="avatar" style={style} src={user.avatar} alt={user.username} />;
  }
  return (
    <div className="avatar avatar-fallback" style={{ ...style, background: pick(user?.username) }}>
      {(user?.username || '?')[0].toUpperCase()}
    </div>
  );
}