export default function ThankYouPage() {
  const wixThankYouUrl = 'https://www.Siamguards.com/thankyou'; // ✅ เปลี่ยน URL เป็นของคุณจริง

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <a
        href={wixThankYouUrl}
        style={{
          display: 'inline-block',
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0066cc',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '0.5rem'
        }}
      >
        🔙 กลับไปยังเว็บไซต์หลัก
      </a>
    </div>
  );
}
