import SignIn from "../components/SignIn";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>
        <SignIn />
      </div>
      <header>
        <h1 className="text-2xl font-bold">
          Connect2Music testportaal
        </h1>
      </header>
      <main className="space-y-8">
        <p>
          Vanaf het moment dat u start met het invullen van
          de vragenlijst worden uw antwoorden opgeslagen en
          bewaard. Wilt u uw antwoord op een vraag
          veranderen of wissen? Ga dan terug naar de vraag
          door op “terug” te klikken, verander of wis het
          antwoord en klik daarna opnieuw op “volgende”.
        </p>
        <p>
          Als u (tussentijds) stopt met deelname aan de
          vragenlijst, blijven uw antwoorden bewaard. Als u
          na het invullen toch niet wilt dat uw antwoorden
          gebruikt worden voor het onderzoek, kunnen wij uw
          antwoorden verwijderen. Daarvoor kunt u contact
          opnemen met connect2music via{" "}
          <a href="mailto:info@connect2music.nl">
            info@connect2music.nl
          </a>
          .
        </p>
      </main>
    </div>
  );
}
