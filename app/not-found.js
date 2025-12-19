export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">Siden findes ikke</h1>
        <p className="text-neutral-600">
          Den side, du prøver at tilgå, eksisterer ikke eller er blevet fjernet.
        </p>
      </div>
    </div>
  );
}