import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  // return <button className="button">{text}</button>;
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddfriend, setShowAddfriend] = useState(false);
  const [addfriend, setAddfriend] = useState(initialFriends);
  const [slectedfriend, setSelectedfriend] = useState(null);

  function handelshowAddfriend() {
    setShowAddfriend(!showAddfriend);
  }

  function handelAddfriends(friend) {
    setAddfriend((i) => [...addfriend, friend]);
  }

  function handelSelectedFriend(friend) {
    setSelectedfriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddfriend(false);
  }

  function handleSplitBill(value) {
    setAddfriend((friends) =>
      friends.map((friend) =>
        friend.id === slectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedfriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={addfriend}
          onSelected={handelSelectedFriend}
          slectedfriend={slectedfriend}
        />
        {showAddfriend && <AddFriendForm onAddFrind={handelAddfriends} />}
        <Button onClick={handelshowAddfriend}>
          {showAddfriend ? "Close " : "Add Friend"}
        </Button>
      </div>
      {slectedfriend && (
        <SplitBillForm
          slectedfriend={slectedfriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelected, slectedfriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelected={onSelected}
          slectedfriend={slectedfriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelected, slectedfriend }) {
  const isSelected = slectedfriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name}
          {Math.abs(`${friend.balance}`)}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelected(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
      {/* <Button text="Select" /> */}
    </li>
  );
}

function AddFriendForm({ onAddFrind }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handelAddSumbit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = 19;
    const newfirend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFrind(newfirend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handelAddSumbit}>
      <label>🧑‍🤝‍🧑 Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBillForm({ slectedfriend, onSplitBill }) {
  const [billvalue, setBillvalue] = useState("");
  const [yourexp, setYourexpe] = useState("");
  const Friendbill = billvalue - yourexp;
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!billvalue || !yourexp) return;
    onSplitBill(whoIsPaying === "You" ? Friendbill : -yourexp);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {slectedfriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={billvalue}
        onChange={(e) => setBillvalue(e.target.value)}
      />

      <label>🧍‍♀️ Your expenseL</label>
      <input
        type="text"
        value={yourexp}
        onChange={(e) =>
          setYourexpe(
            Number(e.target.value) > billvalue
              ? yourexp
              : Number(e.target.value)
          )
        }
      />

      <label>👫 {slectedfriend.name}'s expenseL</label>
      <input type="text" disabled value={Friendbill} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option>You</option>
        <option>{slectedfriend.name}</option>
      </select>

      <Button>Spilt bill</Button>
    </form>
  );
}
