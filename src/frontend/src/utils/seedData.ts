import type { Book, Chapter } from "../backend.d";

export const SAMPLE_BOOKS: Omit<Book, "id">[] = [
  {
    title: "The Midnight Garden",
    author: "Eleanor Voss",
    genre: "Fiction",
    description:
      "A haunting tale of a young botanist who discovers a hidden garden that only blooms under moonlight — and the century-old secrets buried within its roots. A lyrical meditation on memory, loss, and the strange persistence of beauty.",
    coverUrl: "https://picsum.photos/seed/TheMidnightGarden/300/400",
  },
  {
    title: "Echoes of the Cosmos",
    author: "Dr. Nathaniel Crane",
    genre: "Science",
    description:
      "From the birth of stars to the architecture of DNA, this sweeping survey of modern science illuminates the profound connections between the very large and the very small. Written with rare clarity and wonder.",
    coverUrl: "https://picsum.photos/seed/EchoesoftheCosmos/300/400",
  },
  {
    title: "The Fall of Ancient Rome",
    author: "Prof. Helena Marsh",
    genre: "History",
    description:
      "A revisionist account of Rome's collapse that challenges traditional narratives, drawing on newly translated papyri and archaeological discoveries to argue that the empire's end was less a catastrophe than a slow, remarkable transformation.",
    coverUrl: "https://picsum.photos/seed/TheFallofAncientRome/300/400",
  },
  {
    title: "The Iron Citadel",
    author: "Marcus Aldridge",
    genre: "Fantasy",
    description:
      "In a world where magic is mined from the earth like coal, a young engineer apprentice uncovers a conspiracy that reaches the highest towers of the empire. A richly imagined epic of ambition, loyalty, and elemental power.",
    coverUrl: "https://picsum.photos/seed/TheIronCitadel/300/400",
  },
  {
    title: "Letters from the Shore",
    author: "Simone Beauchamp",
    genre: "Fiction",
    description:
      "Told entirely through correspondence between two strangers who found each other's lost notebooks on the same beach, this intimate novel explores love, grief, and the unexpected ways lives become entwined.",
    coverUrl: "https://picsum.photos/seed/LettersfromtheShore/300/400",
  },
  {
    title: "The Philosopher's Kitchen",
    author: "Augusto Ferrara",
    genre: "Philosophy",
    description:
      "A delightful intellectual feast that pairs great philosophical problems with the art of cooking. Each chapter uses a recipe as a lens through which to examine questions of identity, ethics, time, and the good life.",
    coverUrl: "https://picsum.photos/seed/ThePhilosophersKitchen/300/400",
  },
];

export const SAMPLE_CHAPTERS: Record<string, Omit<Chapter, "id" | "bookId">[]> =
  {
    "The Midnight Garden": [
      {
        title: "The First Moon",
        order: BigInt(1),
        content: `The gate was iron, the kind that has forgotten it was ever painted. Mira pressed her fingers against it and felt the cold seep into her knuckles like a warning.

She had come to Ashworth Manor to catalog the herbarium — three thousand specimens pressed flat between acid-free sheets, each one labelled in a hand that trembled with age or urgency, she couldn't tell which. Dr. Pemberton had promised her the work would take a fortnight. That had been six weeks ago.

The garden lay beyond the east wing, separated from the house by a low stone wall. During the day it was unremarkable: overgrown box hedges, a dry fountain the color of old bones, rose canes that scratched the air like accusations. She had walked through it a hundred times on her way to the potting shed and felt nothing.

But tonight, for reasons she could not afterward explain to herself, she had come out at half past two in the morning and found the gate unlatched.

The moonlight was extraordinary. It pooled in the hollows of the garden with a density that seemed almost liquid, and in it she saw flowers she had never seen in daylight. Pale as milk, trembling in no wind. She stepped through the gate and the latch clicked shut behind her.

She did not look back for a very long time.`,
      },
      {
        title: "The Herbarium's Secret",
        order: BigInt(2),
        content: `Specimen 1,847 was pressed between two sheets of cartridge paper that had yellowed to the color of old cream. Mira held it up to the light of the archive lamp and studied the silhouette of the flower with growing unease.

She had studied botany for eleven years. She had worked in herbaria in three countries. She had identified, classified, and catalogued more species than she could count. But she had never seen anything like this.

The petals were wrong. Not subtly wrong — not the kind of variation that might indicate a regional subspecies or an unusual growing condition. Fundamentally, structurally wrong. There were seven petals arranged in a spiral that should have been mathematically impossible, like an Escher staircase rendered in cellulose and chlorophyll.

She checked the label. The handwriting was the same as the others — that spidery, urgent scrawl that she had come to recognize — but instead of a Latin binomial, there were only two words in plain English: *Grows at midnight.*

She set the specimen down carefully. She looked out the archive window at the garden, which lay quiet in the afternoon light. She thought about the gate, and what she had seen, and what she had not dared touch.

Then she opened her field notebook to a fresh page and began to write.`,
      },
      {
        title: "What the Roots Remember",
        order: BigInt(3),
        content: `She found the grave on a Tuesday.

It was not a proper grave — no headstone, no plot, nothing that would have satisfied a sexton or a bureaucrat. Just a slight depression in the earth beneath the oldest of the midnight flowers, a softening of the ground that she might have taken for subsidence if the shape hadn't been so unmistakably human.

She sat with it for a long time. The flowers — she had begun to think of them as the flowers, as though no other flowers existed — swayed around her in their sourceless breeze, and the moonlight did its impossible pooling, and somewhere in the house a clock struck three.

She thought about roots. About what they do in the dark, reaching through soil, through clay, through the decomposed matter of everything that has fallen. About how a tree can draw water from forty feet down, can sense drought and disease through networks of mycelia that stretch for miles. About how nothing is ever truly gone from the earth — only changed, redistributed, incorporated into new forms.

She thought about the handwriting on the specimen label, and the year she had noticed on the herbarium's founding document: 1887, one hundred and thirty years ago, give or take.

She thought about how some flowers only bloom in moonlight.

Then she took out her trowel and began, very carefully, to dig.`,
      },
    ],
    "Echoes of the Cosmos": [
      {
        title: "The Scale of Things",
        order: BigInt(1),
        content: `Begin with a grain of salt.

Hold it between your fingers. Feel how almost nothing it weighs, how the light catches the facets of its crystalline structure. Inside that grain, sodium and chlorine atoms are arranged in a lattice so precise that you could tile an infinite universe with the pattern and it would never need adjustment. There are roughly 10 to the power of 18 atoms in that grain — a billion billion atoms, a number so large that if each atom were a second, the age of the universe would not be enough to count them.

Now look up.

On a clear night, the naked eye can see roughly five thousand stars. A modest telescope reveals millions. A professional observatory, billions. The Hubble Space Telescope has photographed regions of sky no larger than a pinhead held at arm's length and found ten thousand galaxies in that pinhead. Each galaxy contains, on average, a hundred billion stars.

There are more stars in the observable universe than grains of sand on all of Earth's beaches.

But here is what astonishes me most: the same mathematics that describes the lattice of sodium chloride also describes the large-scale structure of the cosmos. The universe, it turns out, is fractal in its elegance — the laws that govern the very small are, in their essential character, the same laws that govern the very large.

We are, all of us, the universe studying itself. And it has been at this a very long time.`,
      },
      {
        title: "How Stars Are Born",
        order: BigInt(2),
        content: `Stars begin as failures.

This is not a poetic observation but a precise one. A nebula — a cloud of hydrogen and helium gas, perhaps with traces of heavier elements scattered by previous stellar deaths — collapses under gravity. As it collapses, it heats. As it heats, the atoms move faster. As they move faster, they collide harder. At some point, if the cloud is massive enough, the collisions become violent enough to overcome the electromagnetic repulsion between protons, and hydrogen nuclei begin to fuse into helium.

The star ignites.

But this only happens if the cloud is above a certain mass threshold. Below that threshold, the gas collapses, heats, but never quite reaches the ignition point. It becomes a brown dwarf: a failed star, glowing with residual heat, cooling slowly over billions of years into a dark and cold object drifting through space. There may be more brown dwarfs in the galaxy than stars.

Our own Sun was born in a stellar nursery about 4.6 billion years ago. We know this from the isotopic ratios in meteorites — ancient rubble from the early solar system that has drifted in the dark, unchanged, since before the Earth existed. These stones are messengers from our beginning. When we hold them, we are holding time.

The Sun will burn for another five billion years. When its hydrogen is exhausted, it will expand into a red giant, swallowing Mercury and Venus and perhaps Earth. Then it will shed its outer layers in a beautiful nebula and collapse into a white dwarf — a city-sized ember, slowly cooling.

The iron in your blood was forged in a star that died before the Sun was born. We are, each of us, the aftermath of a stellar explosion. We are, in the most literal sense, made of stardust.`,
      },
    ],
    "The Fall of Ancient Rome": [
      {
        title: "The Question We Keep Asking",
        order: BigInt(1),
        content: `Edward Gibbon began his Decline and Fall of the Roman Empire in 1776, the same year the American colonies declared their independence from Britain. This coincidence was not lost on his contemporaries, nor on Gibbon himself. The question of why great empires fall has always been asked by people who fear they might be living inside one.

The historiography of Rome's end is a mirror in which each age sees its own anxieties reflected. In the nineteenth century, moralists blamed luxury and decadence — the Romans had grown soft, forgotten the martial virtues of their ancestors. In the early twentieth century, racial theorists pointed to the "barbarization" of the legions. In the Cold War era, economists emphasized fiscal crisis and monetary debasement. In our own time, climate historians have found evidence of a catastrophic cooling event in the sixth century that may have done more damage than any barbarian army.

Each interpretation contains truth. None contains the whole truth.

What I want to argue in this book is something more uncomfortable: that the "fall" of Rome — if we must use that word — was not primarily a catastrophe. It was a transformation. And some of what was transformed was not worth preserving.

This is not to minimize the suffering. The evidence is clear that the fifth century was a period of tremendous violence, economic contraction, and population decline in the western provinces. People died. Cities emptied. Trade routes were severed. Libraries burned.

But the question of whether a civilization "fell" depends entirely on whose perspective you take. For the senatorial aristocracy of Rome, the events of 476 CE were catastrophic. For a peasant farmer in North Africa or a shepherd in Anatolia, the change of rulers — from one distant emperor to another — may have been nearly invisible.

History, as always, is a matter of who is telling it, and who they are telling it for.`,
      },
      {
        title: "The Barbarians at the Gate",
        order: BigInt(2),
        content: `The word "barbarian" is itself a Roman invention — from the Greek barbaros, meaning "one who speaks unintelligibly," i.e., someone who is not us. It was a word designed to create a boundary, to separate the civilized from the uncivilized, the Roman from the other.

The boundary was always porous. It had to be.

The Roman Empire was, from its earliest days, an empire built on integration. Rome did not simply conquer peoples; it absorbed them. The legions were filled with men from every province. Emperors came from Spain, from North Africa, from Syria, from Illyria. The Antonine dynasty — often considered the height of Roman achievement — was Spanish in origin. Septimius Severus, one of the most capable of the third-century emperors, was from what is now Libya. Philip the Arab, emperor from 244 to 249, was from the Roman province of Arabia.

The idea of Rome as a purely Italian or Latin entity was, by the imperial period, largely mythological — a useful story that the Romans told themselves about their past without it bearing much resemblance to the present.

The so-called barbarian federates — the Goths, Vandals, Franks, Burgundians, and others who settled within the empire's borders — were in many cases deeply Romanized before they "invaded." Alaric, who sacked Rome in 410, had served in the Roman army. He was a federatus, a foederatus — an ally bound by treaty to defend Roman territory. What he wanted, what he repeatedly asked for and was repeatedly denied, was a permanent military command within the Roman system: a generalship, a position of recognized authority.

He wasn't trying to destroy Rome. He wanted to be Rome.`,
      },
      {
        title: "The Transformation",
        order: BigInt(3),
        content: `There is a monastery in the hills above Subiaco, about an hour east of Rome, called the Sacro Speco — the Holy Cave. It was built around the cave where Saint Benedict of Nursia lived as a hermit in the late fifth and early sixth centuries, in precisely the period that traditional historiography marks as Rome's darkest hour.

From this cave, and from the monastery Benedict later founded at Monte Cassino, emerged the Rule of Saint Benedict: a document of extraordinary practical wisdom that would shape European civilization for a thousand years. It prescribed a day divided between prayer, work, and study. It insisted on the dignity of manual labor. It established libraries and scriptoria — rooms where monks copied manuscripts, preserving the literature of antiquity through the centuries of disorder.

The monasteries were Rome's backup drive.

This is a strange way to put it, but I think it captures something essential. When the political and economic structures of the western empire collapsed, the Church — which had grown within those structures — did not collapse with them. It had developed parallel institutions, parallel hierarchies, parallel networks of communication and trust. Bishops took over functions that municipal administrators had formerly performed. Monasteries became centers of agricultural innovation, medical care, and learning.

The Roman Empire did not simply disappear. It transformed into something else — something more religious, more localized, more feudal. Whether that something was better or worse depends on who you were and when you lived.

What we call the Middle Ages was, in many ways, Rome continued by other means.`,
      },
    ],
    "The Iron Citadel": [
      {
        title: "The Vein",
        order: BigInt(1),
        content: `The aetherium vein ran forty feet beneath the city of Castrumvale, and everyone in the lower quarters could feel it.

Not feel it as in sense it with their skin — though the miners said that after thirty years underground you developed a kind of vibration in your bones, a hum that never quite went away. Feel it as in live with it the way you live with a river: constantly, practically, building your life around its rhythms. The vein's output determined the price of heat-stones in the market. It determined which neighborhoods had running light and which made do with tallow candles. It determined, in ways more subtle but no less real, who had power and who did not.

Davan Ashkelon was seventeen years old and had been an apprentice at the Bureau of Aetheric Engineering for eleven months when he first saw the vein up close.

He had expected something dramatic — a seam of glowing mineral, perhaps, something that looked as dangerous as it was. What he saw instead was a crack in the rock face roughly the width of his hand, from which emanated a faint bluish luminescence, the color of moonlight on water. A foreman stood beside it with instruments, taking measurements with the practiced boredom of someone who had done this ten thousand times.

"That's it?" Davan said.

The foreman glanced at him. "What were you expecting?"

"I don't know. More."

"More," the foreman repeated, and there was something in his voice that Davan would only understand much later — not contempt, but a kind of tired recognition. "Son, the whole empire runs on that crack. Kings have died for it. Cities have been built and destroyed for the right to stand above it. Wars have been fought in every direction you can name to protect the supply chains that carry what comes out of it." He tucked his instruments back into his belt. "It always looks like less than you expect. That's what makes it dangerous."`,
      },
      {
        title: "The Bureau's Secret",
        order: BigInt(2),
        content: `The Bureau of Aetheric Engineering occupied the top three floors of the Spire of Calculation, which was, by imperial decree, the tallest structure in Castrumvale. From his desk in the apprentices' hall, Davan could look out over the city's roofscape to the distant smudge of the harbor, and on clear days catch a glint of the sea beyond.

He spent most of his time looking at ledgers.

This was, he had been informed, the essential skill of the Bureau: not the glamorous work of aetheric resonance mapping or stabilization engineering, but the patient, meticulous work of recording. Every vein in the empire was catalogued here, its output measured daily, its fluctuations analyzed and archived in volumes that filled the Bureau's library to the ceiling. There were veins in the catalogue that had not been active for two hundred years. There were projected sites that had never been excavated. There was data, in the Bureau's archives, going back four centuries.

It was in these archives, six months into his apprenticeship, that Davan found the discrepancy.

He had been assigned to cross-reference current output figures against historical projections — routine work, the kind that was given to apprentices specifically because it was too tedious for senior engineers to bother with. But Davan had a habit, which his mother had called stubbornness and his teachers had called something less polite, of following numbers wherever they led.

The figures in the current output reports did not match the figures in the historical archive.

Not by a little. By roughly thirty percent.

Either the empire's aetheric reserves were being systematically underreported, or someone had been quietly siphoning off a third of the empire's magical output for — he checked the earliest discrepancy — at least sixty years.

He closed the ledger. He sat very still for a long time. Then he looked around the empty archive room and began, very carefully, to take notes.`,
      },
      {
        title: "The First Ally",
        order: BigInt(3),
        content: `Engineer Calix Thornwood was fifty-three years old, had been with the Bureau for thirty years, and had the look of a man who had long ago decided that survival was a more reliable goal than justice.

Davan found him in the sub-basement laboratory at an hour when no one sensible would be working, running calibration tests on a resonance amplifier that looked like it had been repaired so many times its original design was more theoretical than actual.

"I know about the discrepancy," Davan said, because he had spent two weeks trying to think of a subtle approach and had concluded he didn't have the temperament for subtlety.

Thornwood did not look up from his instruments. "Which discrepancy?"

"The thirty percent."

A long pause. The resonance amplifier hummed. Somewhere above them, the city of Castrumvale went about its business, entirely unaware that the infrastructure it depended on had been quietly hollowed out for sixty years.

"Sit down," Thornwood said finally. "And lower your voice."

Davan sat. Thornwood put down his instruments and looked at him with an expression that Davan had not expected: not fear, not anger, but something that looked almost like relief.

"I've been waiting," Thornwood said, "for seventeen years, for someone young enough not to know better and stubborn enough to keep looking, to find that number." He folded his hands on the workbench. "Now that you have, I need to tell you something important."

"What?"

"The people who are taking the thirty percent — they control the Bureau's administration, the Imperial Office of Supply, and at least two of the seven High Marshals. They have been doing this since before your parents were born. They have killed, or caused to disappear, at least nine people who found evidence of what they're doing." He paused. "And now you've found it."

Davan thought about this. "So what do I do?"

Thornwood almost smiled. "That," he said, "is exactly the right question."`,
      },
    ],
    "Letters from the Shore": [
      {
        title: "The First Letter",
        order: BigInt(1),
        content: `*Found on the beach at Cala Figuera, Mallorca, 14 September. Tucked inside a red notebook, which I have kept. — I.*

---

To the person who left the notebook:

I want to start by telling you that I am not, as a rule, someone who picks up other people's belongings. I was brought up with a fierce sense of the line between what is mine and what is not. But you left this on the exact rock where I go to sit when I need to think, and by the time I found it the tide had come in enough that leaving it would have meant losing it to the sea, and the sea seemed like the wrong fate for something that had clearly been loved.

I have read enough to know that it matters to you. I have not read more than that.

If this reaches you — and I confess I have no idea how to arrange that, given that you seem to have no last name and no address, only an initial and a frankness about your grief that made me put the notebook down and look out at the water for a long time — I want you to know that it is safe.

And if you want it back, or want to talk, you could leave a note in the crook of the old fig tree at the end of the northern path. I walk that way every morning.

With genuine sympathy,
I.

*P.S. I left my own notebook in the fig tree. So we'd be even.*`,
      },
      {
        title: "The Reply",
        order: BigInt(2),
        content: `*Found in the fig tree, 17 September. Written on pages torn from a different notebook, smaller, with blue lines. — L.*

---

Dear I.,

I have spent three days deciding whether to answer this, and I am still not sure I've made the right decision.

The notebook was my husband's. He died in April. We used to come to Cala Figuera every September — it was a kind of ritual, the kind of ritual that only makes sense to the two people inside it, and now there is only one of me, so I came anyway, because I didn't know what else to do with September.

I sat on that rock and I couldn't write anything. I put the notebook down and I walked to the end of the beach and back, and when I came back the notebook was gone. I thought the sea had taken it, and I felt — I'm not sure "relieved" is the right word. Less burdened. As though the sea had taken some of the September with it.

And then I found your note in the fig tree.

I don't want the notebook back. But I am curious about you, I., who picks up notebooks that don't belong to you and then writes letters to their owners rather than simply keeping them or discarding them. What kind of person does that?

With cautious curiosity,
L.

*P.S. I left you a tangerine in the fig tree. It seemed rude to take the notebook and leave nothing.*`,
      },
    ],
    "The Philosopher's Kitchen": [
      {
        title: "Onions and Identity",
        order: BigInt(1),
        content: `There is a classic thought experiment in philosophy called the Ship of Theseus. The ancient hero's ship is preserved in the harbor of Athens as a monument. Over the centuries, as planks rot and ropes fray, they are replaced one by one with new materials. After a hundred years, every single plank and rope and bolt has been replaced. Is it still the Ship of Theseus?

I first encountered this problem not in a philosophy lecture but in a kitchen.

I was making soffritto — the Italian base of slow-cooked onions, celery, and carrot that underlies half the cuisine of the peninsula. My grandmother had taught me how to do this. Her grandmother had taught her. The recipe, if you can call it that, consisted of nothing more than "cook the vegetables slowly until they are almost nothing."

I was peeling onions, and as I peeled I watched the layers come away, each one revealing another beneath it, each one parchment-thin and papery. And I thought: where is the onion? Is it the outermost layer, the first thing you see? Is it the innermost, the small pale heart at the center? Is it the sum of all the layers, or is it something that exists only in the aggregate, something that disappears when you reduce it to its parts?

Heraclitus famously said that you cannot step in the same river twice, because new waters are always flowing. But surely you also cannot peel the same onion twice — the second peeling reveals a different vegetable, smaller, more concentrated, closer to whatever essential onion-ness lies beneath.

This is not merely a question about onions. It is a question about everything that persists through change: rivers, ships, selves.

Put the knife down for a moment. Think about who you were ten years ago. How many of your cells have been replaced? How many of your beliefs? How many of your relationships, your habits, your fears? Is the person reading these words the same person who opened this book, or merely someone who remembers being that person?

The onion is still in your hand. Cook it slowly. We will return to this.`,
      },
      {
        title: "The Ethics of the Table",
        order: BigInt(2),
        content: `Every meal is a political act.

I do not mean this in the narrow, hectoring sense that has made dinner parties so anxious in recent decades — where every ingredient must be interrogated for its carbon footprint, its labor practices, its impact on indigenous land rights. Those concerns are real and should not be dismissed. But I mean something older and deeper: the choice of who sits at your table, and what you serve them, and how, has always encoded your values, your hierarchies, your sense of what and who matters.

In ancient Rome, dinner parties were carefully calibrated performances of social status. The quality of the food you received depended on your rank — guests of lower standing were given cheaper wine, smaller portions, less exotic delicacies. The arrangement of couches, the order of courses, the quality of the entertainments: everything communicated where you stood in the social order.

In medieval Europe, the great hall was a theater of hierarchy: the lord sat at the high table, elevated on a dais, served first and best. The further down the table you sat, the less you mattered. The distinction between the high table and the low was not metaphorical; it was architectural.

We have tried, in democratic modernity, to escape this. The round table of Arthurian legend — where all sit as equals — became an ideal, a symbol of a different kind of community. And yet, look at any dinner party and you will find hierarchy still operating: the guest of honor, the host's right hand, the careful placement of compatible personalities and incompatible ones.

We cannot, it seems, eat without making statements about order and value.

The question is not whether to make those statements, but whether to make them consciously, with intention, and with the kind of generosity that recognizes every guest's hunger as equal to your own.

Now: let us talk about bread.`,
      },
    ],
  };
