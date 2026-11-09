export default function UpgradeButton({ label = "Upgrade to Pro" }: { label?: string }) {
  return (
    <form action="/api/checkout" method="POST">
      <button className="btn accent">{label}</button>
    </form>
  );
}
