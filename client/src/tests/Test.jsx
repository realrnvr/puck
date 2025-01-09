import "./test.css";
import ReactMarkdown from "react-markdown";

const Test = () => {
  const description = `Guts, known as the Black Swordsman, seeks sanctuary from the demonic forces attracted to him and his woman because of a demonic mark on their necks, and also vengeance against the man who branded him as an unholy sacrifice.\n\nAided only by his titanic strength gained from a harsh childhood lived with mercenaries, a gigantic sword, and an iron prosthetic left hand, Guts must struggle against his bleak destiny, all the while fighting with a rage that might strip him of his humanity.  \n  \n***Won the 6th Osamu Tezuka Cultural Prize Excellence Award in 2002.***\n\n---\n\nNote: Following Miura Kenta's death in 2021, the series has been taken over by Kouji Mori, who supervises the series with art done by Studio Gaga.`;

  return (
    <>
      <div className="test">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </>
  );
};

export default Test;
