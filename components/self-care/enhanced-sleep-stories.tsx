"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MobileFriendlyWrapper } from "./utils/mobile-touch-utils"

interface EnhancedSleepStoriesProps {
  onBack: () => void
}

// Simple stories data structure
const stories = [
  {
    title: "The Clockmaker's Secret",
    desc: "A reclusive clockmaker discovers a time-traveling pocket watch.",
    color: "from-amber-400 to-orange-600",
    totalPages: 50,
    pages: [
      ["The Workshop", "In a cobblestone alley of Victorian London, Elias Thorne, a reclusive clockmaker, worked in his dimly lit shop, surrounded by ticking clocks that whispered secrets of time."],
        ["The Mysterious Watch", "One rainy evening, Elias found an ornate pocket watch among his late father's tools, its hands frozen at midnight, glowing faintly with an unnatural light."],
        ["First Tick", "Curiosity got the better of him. Elias wound the watch, and the room spun, landing him in a bustling market square—London, 1723."],
        ["A Familiar Face", "In the market, Elias spotted a young man who looked eerily like his father, but younger, laughing with a woman who wore the same watch around her neck."],
        ["The Timekeeper's Guild", "The woman, Clara, revealed she was part of the Timekeeper's Guild, a secret society guarding time-travel devices to prevent timeline disruptions."],
        ["A Dire Warning", "Clara warned Elias that the watch was unstable, prone to creating paradoxes, and that someone was hunting it to rewrite history for personal gain."],
        ["The Chase Begins", "Back in his own time, Elias noticed a shadowy figure watching his shop. The watch vibrated, urging him to flee into another era."],
        ["Paris, 1889", "Elias landed at the foot of the half-built Eiffel Tower. The shadowy figure, a man named Victor, appeared, demanding the watch with a sinister grin."],
        ["A Clever Disguise", "Elias, thinking fast, posed as a French engineer, blending into the construction crew to evade Victor's pursuit through the iron lattice."],
        ["The Watch's Power", "In a quiet moment, Elias discovered the watch could not only jump through time but also slow it down, giving him precious seconds to plan."],
        ["A Hidden Message", "Inside the watch, Elias found an inscription from his father: 'Protect the flow, trust Clara.' His father had been a Timekeeper too."],
        ["Victor's Plan", "Victor cornered Elias in a Parisian café, revealing his plan to use the watch to prevent the Industrial Revolution, amassing wealth in a simpler era."],
        ["An Unexpected Ally", "Clara reappeared, now older, with a second watch. She taught Elias to sync their devices, creating a temporary time shield around them."],
        ["The Guild's Sanctuary", "Clara took Elias to 15th-century Florence, to the Guild's hidden sanctuary in a cathedral's crypt, filled with ancient timekeeping relics."],
        ["Training Montage", "Elias trained with the Guild, learning to navigate time jumps without causing ripples, all while clocks ticked in hypnotic unison around him."],
        ["A Traitor Revealed", "A Guild member, jealous of Elias's natural talent, was secretly feeding Victor information, hoping to steal the watch for himself."],
        ["The Betrayal", "During a jump to ancient Egypt, the traitor sabotaged Elias's watch, stranding him in a sandstorm near the pyramids under construction."],
        ["A Desert Escape", "Elias, using his clockmaker skills, repaired the watch with a shard of quartz, escaping just as Victor's men closed in."],
        ["The Time Loop", "Back in Florence, Elias accidentally created a time loop, reliving the same hour repeatedly, each cycle revealing more about Victor's plan."],
        ["Clara's Secret", "Clara confessed she was Elias's mother from a future timeline, sent back to protect him, explaining her ageless appearance."],
        ["The Twist", "Victor was Elias's brother from another timeline, abandoned by their parents, now seeking revenge by unraveling their family's legacy."],
        ["The Confrontation", "In 1920s New York, atop a skyscraper under construction, Elias faced Victor, the watch pulsing wildly, threatening to collapse time itself."],
        ["A Heartfelt Plea", "Elias, instead of fighting, offered Victor forgiveness, sharing memories of their childhood through the watch's memory projection."],
        ["The Climax", "Victor, moved but stubborn, lunged for the watch. Elias slowed time, dodging, and locked Victor in a time prison—a single frozen moment."],
        ["Restoring Balance", "With Clara's help, Elias returned to the Guild, recalibrating the watch to heal the timeline rifts caused by their jumps."],
        ["The Final Jump", "Elias made one last jump to his father's time, leaving the watch with a note: 'Keep it safe for me.' His father smiled, understanding."],
        ["Back to the Shop", "Returning to his shop in Victorian London, Elias hid the watch in a secret compartment, vowing to protect it as a silent guardian."],
        ["A New Customer", "A young woman entered the shop, asking for a peculiar clock repair. Elias noticed her necklace—a watch identical to his own."],
        ["The Guild's Future", "The woman revealed she was a new Guild recruit, hinting at more adventures. Elias smiled, ready to teach her the ways of time."],
        ["A Quiet Evening", "That night, Elias sat by his fireplace, the shop's clocks ticking in harmony, feeling the weight of time's secrets in his heart."],
        ["The Watch's Whisper", "The hidden watch hummed softly, as if alive, reminding Elias that time was never truly still, always waiting for the next journey."],
        ["A Funny Mishap", "Elias once jumped to 1969, landing in a disco club, his Victorian attire causing a hilarious stir among the bell-bottomed dancers."],
        ["The Timekeeper's Code", "Elias memorized the Guild's code: 'Time flows for all; guard it with love.' It became his mantra during tough jumps."],
        ["Victor's Redemption", "In the time prison, Victor began to reflect, his heart softening. Elias left a note, hoping one day to free him."],
        ["Clara's Legacy", "Clara gifted Elias her watch, its inscriptions revealing her sacrifices to protect him across countless timelines."],
        ["The Shop's Secret", "Elias discovered his shop was a time nexus, built on a ley line that stabilized time jumps, explaining its timeless aura."],
        ["A Child's Visit", "A curious child visited the shop, asking about the glowing watch. Elias told a 'fairy tale' about time travelers, winking."],
        ["The Guild's Council", "Elias was invited to join the Guild's council, his bravery earning respect among the ancient timekeepers."],
        ["A Moment of Peace", "During a jump to ancient Greece, Elias rested by a quiet stream, the watch silent, letting him savor a timeless moment."],
        ["The Watch's Guardian", "Elias realized he was now the watch's true guardian, its power safe only in his hands, guided by love and duty."],
        ["A Twist in Time", "A future version of Elias appeared briefly, warning of a new threat—a rogue timekeeper seeking the watch's twin."],
        ["The City's Pulse", "In modern Tokyo, Elias felt the city's rhythm sync with the watch, teaching him to blend past and future seamlessly."],
        ["A Friend's Return", "The traitor, now reformed, returned to help Elias protect the watch, earning his trust through selfless acts."],
        ["The Watch's Song", "The watch began to hum a melody during jumps, a song of time that calmed Elias during chaotic leaps."],
        ["A Family Reunited", "In a final jump, Elias brought his family together in a timeless meadow, healing old wounds with shared memories."],
        ["The Shop's Legacy", "Elias trained a young apprentice, passing on the shop's secrets, ensuring the watch's safety for generations."],
        ["A New Adventure", "A strange signal from the watch hinted at a distant era needing help. Elias prepared for his next jump, heart racing."],
        ["The Clockmaker's Oath", "Elias swore to protect time's flow, his shop a beacon for lost travelers in the vast river of time."],
        ["The Final Scene", "As Elias closed his shop for the night, the watch glowed softly, whispering of new stories waiting beyond the horizon."],
      ]
    },
    {
      title: "The Celestial Cartographer",
      desc: "A mapmaker charts a galaxy of living stars.",
      color: "from-indigo-400 to-purple-600",
      totalPages: 60,
      pages: [
        ["The Starlit Studio", "In a floating observatory above a nebula, Lyra, a young cartographer, crafted maps of living stars that sang their own stories."],
        ["The Cosmic Compass", "Lyra inherited a compass that pointed not to north but to sentient stars seeking help, its needle glowing with stardust."],
        ["First Voyage", "Guided by the compass, Lyra piloted her ship, the Astralis, to a star named Solara, crying for help through cosmic waves."],
        ["Solara's Plight", "Solara, a young star, was dimming, its light stolen by a rogue black hole feeding on its energy to grow unnaturally."],
        ["The Map's Secret", "Lyra's map revealed hidden pathways through the galaxy, shortcuts through wormholes that could reach Solara in time."],
        ["The Galactic Council", "Lyra sought the Galactic Council, a group of ancient stars who governed cosmic balance, meeting in a radiant nebula."],
        ["A Risky Proposal", "The Council refused to act, fearing disruption. Lyra proposed a daring plan to redirect the black hole using her maps."],
        ["The Rogue Navigator", "A rival cartographer, Cassian, appeared, claiming he could save Solara faster but with ulterior motives to control the galaxy."],
        ["A Starlit Duel", "Lyra challenged Cassian to a mapmaking duel, their charts racing to find the safest path to Solara through cosmic storms."],
        ["The Compass's Warning", "The compass vibrated, warning Lyra that Cassian's maps were rigged to destabilize stars, creating chaos for profit."],
        ["A Hidden Ally", "Solara sent a fragment of its light to Lyra, forming a tiny star-companion named Flicker, who could sense lies."],
        ["The Nebula Trap", "Cassian lured Lyra into a nebula maze, where gravity distorted her maps, but Flicker guided her with its honest glow."],
        ["Lyra's Discovery", "Lyra found an ancient star chart in the nebula, revealing a forgotten technique to redirect black holes using gravitational songs."],
        ["The Song of Stars", "Lyra sang the gravitational song, taught by the chart, harmonizing with Solara to weaken the black hole's pull."],
        ["Cassian's Betrayal", "Cassian stole Lyra's compass mid-song, aiming to control Solara's energy, but Flicker burned brightly, exposing him."],
        ["The Council's Change", "The Council, moved by Lyra's courage, joined her song, amplifying it across the galaxy to restore Solara's light."],
        ["A Funny Mishap", "During a test song, Lyra accidentally made a dwarf star sneeze, showering her ship in harmless cosmic dust, much to Flicker's amusement."],
        ["The Black Hole's Heart", "Lyra discovered the black hole was sentient, manipulated by Cassian, and offered it freedom in exchange for peace."],
        ["The Climax", "In a dazzling confrontation, Lyra and Flicker outwitted Cassian, redirecting the black hole to a barren region, saving Solara."],
        ["Restoring the Map", "Lyra redrew her maps, marking safe paths for stars, ensuring no black hole could threaten them again."],
        ["Cassian's Redemption", "Cassian, humbled, offered to help Lyra map uncharted galaxies, seeking forgiveness for his greed."],
        ["The Star's Gratitude", "Solara gifted Lyra a piece of its core, a glowing orb that enhanced her compass's ability to find lost stars."],
        ["A New Journey", "The compass pointed to a distant galaxy cluster, whispering of a star colony in need. Lyra set sail, heart full of hope."],
        ["The Observatory's Secret", "Lyra's observatory was revealed to be a living star itself, choosing her as its cartographer for her pure heart."],
        ["Flicker's Growth", "Flicker grew into a small star, orbiting Lyra's ship, its light guiding her through the darkest cosmic voids."],
        ["The Council's Trust", "The Council named Lyra their chief cartographer, entrusting her with mapping the entire galactic network."],
        ["A Starlit Festival", "Stars across the galaxy celebrated Solara's recovery, their lights dancing in patterns Lyra charted with joy."],
        ["The Compass's Song", "The compass began to hum a melody, syncing with Lyra's maps, creating a cosmic symphony that soothed troubled stars."],
        ["A Child's Dream", "A young star, inspired by Lyra, sent her a vision of itself becoming a cartographer, asking to learn her ways."],
        ["The Nebula's Gift", "The nebula maze gifted Lyra a crystal that enhanced her maps, showing hidden dimensions of the cosmos."],
        ["Lyra's Mentor", "An ancient star, Orionis, mentored Lyra, teaching her to read the emotional pulses of stars to better aid them."],
        ["The Black Hole's Peace", "The black hole, now free, became a guardian of the galaxy's edge, protecting stars from external threats."],
        ["A Twist in the Stars", "Lyra found a star that was her own reflection from a parallel universe, hinting at a multiversal mapmaking destiny."],
        ["The Galaxy's Rhythm", "Lyra learned to feel the galaxy's pulse, her maps syncing with its rhythm to predict cosmic events."],
        ["Cassian's Return", "Cassian proved his loyalty, helping Lyra save a dying star, earning a place as her trusted partner."],
        ["The Observatory's Light", "The observatory glowed brighter, its star-heart proud of Lyra's growth as the galaxy's greatest cartographer."],
        ["A Starlit Promise", "Lyra vowed to map every star's story, ensuring no light would ever dim under her watchful care."],
        ["The Compass's Legacy", "Lyra began training young cartographers, passing the compass's secrets to those with pure hearts."],
        ["A Funny Encounter", "Lyra once mapped a star that giggled, its light tickling her ship, causing Flicker to burst into starry laughter."],
        ["The Council's Vision", "The Council foresaw a cosmic storm, asking Lyra to map a safe path for all stars to weather it."],
        ["The Star's Family", "Solara revealed it had a family of smaller stars, reunited thanks to Lyra's maps, their lights merging in joy."],
        ["The Nebula's Memory", "The nebula shared memories of ancient cartographers, inspiring Lyra to create a galactic archive of maps."],
        ["Lyra's Reflection", "Lyra met her parallel self, exchanging maps that revealed new ways to navigate multiversal pathways."],
        ["The Galaxy's Heart", "Lyra found the galaxy's core, a massive star that pulsed with love, guiding her maps with its light."],
        ["A New Ally", "A rogue comet joined Lyra, carrying messages between stars, speeding up her mapping missions."],
        ["The Observatory's Song", "The observatory sang a lullaby to the galaxy, its melody helping Lyra map peaceful routes."],
        ["The Stars' Gratitude", "Stars across the galaxy sent Lyra light-messages, thanking her for their safety and harmony."],
        ["A Twist of Fate", "Lyra discovered her compass could map future events, hinting at a cosmic war she needed to prevent."],
        ["The Council's Honor", "The Council crafted a star in Lyra's name, its light a beacon for all cartographers to follow."],
        ["Flicker's Destiny", "Flicker chose to stay with Lyra, its light growing brighter with each map she completed."],
        ["The Galaxy's Peace", "Lyra's maps created a network of safe paths, ensuring peace for all stars in her galaxy."],
        ["A Child's Map", "A young star sent Lyra its first map, a clumsy but heartfelt chart, which she proudly added to her collection."],
        ["The Compass's Final Gift", "The compass revealed a hidden map, showing Lyra her own destiny as the eternal cartographer."],
        ["The Nebula's Farewell", "The nebula gifted Lyra a final crystal, allowing her to see the emotions of stars in vivid color."],
        ["Lyra's Oath", "Lyra swore to protect the galaxy's light, her maps a testament to her love for every star."],
        ["The Observatory's Future", "The observatory prepared for a new journey, its star-heart ready to guide Lyra to uncharted galaxies."],
        ["The Final Scene", "Lyra stood in her observatory, compass in hand, mapping a new star's story, her heart alight with cosmic wonder."],
      ]
    },
    {
      title: "The Phantom Library",
      desc: "A librarian guards a library where books rewrite reality.",
      color: "from-violet-400 to-indigo-600",
      totalPages: 55,
      pages: [
        ["The Hidden Library", "Deep beneath Edinburgh, in a labyrinth of stone, stood the Phantom Library, where books could rewrite reality, guarded by librarian Nora Finch."],
        ["The Forbidden Book", "Nora discovered a glowing book titled 'The Weave,' its pages pulsing with power to alter the fabric of existence."],
        ["A Strange Visitor", "A cloaked figure, Elias, entered the library, claiming the book could save his dying world but needed Nora's help to read it."],
        ["The Library's Rules", "The library whispered its rules to Nora: only those with pure intent could touch 'The Weave' without unraveling reality."],
        ["Elias's Tale", "Elias revealed his world was fading due to a reality rift, caused by a rogue librarian who misused a similar book centuries ago."],
        ["The First Page", "Nora opened 'The Weave,' its words shifting, showing visions of Elias's world—a barren land where colors had vanished."],
        ["The Shadow Scribe", "A shadowy figure, the Shadow Scribe, appeared, seeking 'The Weave' to erase entire histories for power."],
        ["The Library's Defense", "The library came alive, its shelves shifting to trap the Shadow Scribe, but he escaped, vowing to return with allies."],
        ["Nora's Training", "Elias taught Nora to read the book's intent, sensing which words could heal and which could destroy, a delicate balance."],
        ["A Funny Mishap", "Nora misread a page, accidentally turning a library cat into a talking philosopher, who offered witty but useless advice."],
        ["The Rift's Source", "Nora and Elias traced the rift to a forgotten page in 'The Weave,' hidden in a locked vault guarded by spectral books."],
        ["The Vault's Puzzle", "The vault required Nora to solve a riddle written in starlight, testing her heart's purity and her love for knowledge."],
        ["The Scribe's Trap", "The Shadow Scribe set a trap, rewriting a hallway to loop endlessly, but Nora's cat, now wise, guided her out."],
        ["The Book's Power", "'The Weave' revealed it could rewrite small events, like healing a broken bridge in Elias's world, giving Nora hope."],
        ["Elias's Secret", "Elias admitted he was once a scribe who helped create 'The Weave,' but left when he saw its dangerous potential."],
        ["The Library's Heart", "Nora found the library's heart—a glowing book that synced with her emotions, amplifying her ability to control 'The Weave.'"],
        ["The Scribe's Army", "The Shadow Scribe returned with an army of rewritten characters from fiction, each bent on stealing the book."],
        ["The Battle of Words", "Nora fought back, using 'The Weave' to summon heroic characters from classic novels, creating an epic literary showdown."],
        ["A Twist Revealed", "The Shadow Scribe was Nora's long-lost brother, corrupted by the book's power, seeking to erase their painful past."],
        ["The Climax", "In the library's core, Nora faced her brother, using 'The Weave' to rewrite his pain into hope, saving him from himself."],
        ["Restoring Reality", "Nora and Elias used 'The Weave' to close the rift, colors flooding back into his world, vibrant and alive."],
        ["The Library's Gift", "The library rewarded Nora with a new book, 'The Mend,' which could heal emotional wounds across realities."],
        ["Elias's Farewell", "Elias returned to his world, promising to visit Nora, leaving her a bookmark that glowed when he thought of her."],
        ["The Cat's Wisdom", "The talking cat, now a permanent fixture, offered Nora cryptic advice, often with a humorous twist, keeping her grounded."],
        ["A New Visitor", "A young girl entered the library, seeking a book to heal her broken dreams, starting Nora's next adventure."],
        ["The Library's Growth", "The library expanded, new shelves appearing for unwritten stories, hinting at realities yet to be shaped."],
        ["Nora's Oath", "Nora swore to guard 'The Weave,' using its power only for good, her heart now part of the library's magic."],
        ["A Funny Incident", "Nora once rewrote a page, accidentally turning rain into chocolate syrup, delighting the library's ghostly patrons."],
        ["The Scribe's Redemption", "Nora's brother, now healed, began training as a librarian, hoping to atone for his past mistakes."],
        ["The Book's Song", "'The Weave' began to hum, its melody guiding Nora to new pages that could heal entire worlds."],
        ["The Library's Network", "Nora discovered other phantom libraries across dimensions, each with a guardian like her, forming a cosmic network."],
        ["A Child's Story", "The young girl wrote her own page in 'The Mend,' healing her dreams and inspiring Nora to teach others."],
        ["The Rift's Echo", "A faint rift reappeared, suggesting the Shadow Scribe's allies were still out there, plotting revenge."],
        ["Elias's Return", "Elias returned with news of a new threat—a book that could erase entire libraries, needing Nora's help."],
        ["The Library's Light", "The library's heart glowed brighter, its light guiding Nora through the darkest pages of 'The Weave.'"],
        ["A Twist of Fate", "Nora found a page showing her as a child writing 'The Weave,' hinting she was its true creator in a past life."],
        ["The Council's Call", "A council of librarians from other dimensions summoned Nora, recognizing her as the greatest guardian."],
        ["The Cat's Role", "The cat revealed it was a guardian spirit, choosing Nora to protect the library for its pure heart."],
        ["The Library's Peace", "Nora restored peace to the library, its shelves humming with stories waiting to be read."],
        ["A New Book", "A blank book appeared, titled 'The Future,' inviting Nora to write her own story, full of hope."],
        ["The Scribe's Gift", "Nora's brother gifted her a pen that could write without altering reality, a tool for safe storytelling."],
        ["The Girl's Growth", "The young girl became Nora's apprentice, her dreams now shaping new pages in 'The Mend.'"],
        ["The Library's Song", "The library sang a lullaby, its melody soothing Nora as she prepared for new adventures."],
        ["Elias's Promise", "Elias vowed to protect his world's library, linking it to Nora's, creating a bond across dimensions."],
        ["The Rift's Closure", "Nora sealed the final rift, ensuring no rogue scribe could threaten reality again."],
        ["The Cat's Humor", "The cat, now fond of pranks, turned a page into a comedy script, making Nora laugh during a tense moment."],
        ["The Council's Honor", "The council named Nora the Keeper of Stories, her name etched in starlight across dimensions."],
        ["The Library's Future", "The library hinted at new books forming, each a story from a different reality needing Nora's care."],
        ["Nora's Reflection", "Nora saw her reflection in 'The Weave,' showing her as a timeless guardian, forever tied to the library."],
        ["The Girl's Destiny", "The young girl wrote her first full story, a tale of hope that glowed in the library's heart."],
        ["The Scribe's Peace", "Nora's brother found peace, his new role as a librarian healing his heart completely."],
        ["The Library's Call", "A new book glowed, calling Nora to a distant reality where stories needed her protection."],
        ["The Final Scene", "Nora stood in the Phantom Library, 'The Weave' in hand, ready to write the next chapter of her eternal guardianship."],
      ]
    },
    {
      title: "The Sky Pirate's Compass",
      desc: "A pirate captain seeks a legendary compass that controls the winds.",
      color: "from-teal-400 to-cyan-600",
      totalPages: 50,
      pages: [
        ["The Sky Ship", "Captain Zara sailed the Nimbus, a sky ship floating among clouds, her crew a ragtag band of dreamers seeking freedom."],
        ["The Lost Compass", "Legends spoke of the Zephyr Compass, a device that could command winds, hidden in the floating Isles of Mist."],
        ["The First Clue", "Zara found a map in a bottle, dropped by a storm raven, pointing to the first isle, guarded by cloud serpents."],
        ["The Serpent's Lair", "The Nimbus docked at the misty isle, where Zara faced a serpent that spoke in riddles, testing her wit."],
        ["A Clever Answer", "Zara solved the riddle with a joke, making the serpent laugh, revealing the first piece of the compass in its hoard."],
        ["The Rival Pirate", "Captain Draven, a ruthless sky pirate, ambushed the Nimbus, demanding the map, his ship armed with lightning cannons."],
        ["A Daring Escape", "Zara outmaneuvered Draven, using a sudden fog to hide, but the map was damaged, its next clue barely legible."],
        ["The Wind Temple", "The clue led to a temple floating on a hurricane's eye, where priests worshipped the Zephyr Compass as a god."],
        ["The Trial of Gales", "Zara faced the temple's trial, navigating a maze of violent winds, her agility saving her from deadly gusts."],
        ["The Second Piece", "The priests, impressed, gave Zara the second compass piece, warning that its power could destroy the skies if misused."],
        ["Draven's Betrayal", "Draven revealed he was once Zara's mentor, now seeking the compass to control all sky trade routes for profit."],
        ["A Funny Mishap", "Zara's crew accidentally activated a wind charm, blowing their hats into a flock of sky parrots, causing chaos."],
        ["The Third Isle", "The final clue pointed to an isle hidden in a permanent storm, accessible only by riding a rogue wind current."],
        ["The Storm's Heart", "Zara piloted the Nimbus through lightning and rain, her crew singing shanties to keep spirits high."],
        ["The Compass's Guardian", "A wind elemental guarded the final piece, challenging Zara to prove her heart was pure enough to wield the compass."],
        ["Zara's Truth", "Zara admitted she sought the compass to free sky cities from Draven's tyranny, her honesty swaying the elemental."],
        ["The Compass Assembled", "With all pieces united, the Zephyr Compass glowed, letting Zara summon gentle breezes or mighty gales."],
        ["Draven's Attack", "Draven's fleet surrounded the Nimbus, cannons blazing, but Zara used the compass to summon a protective whirlwind."],
        ["The Climax", "In a sky battle above the storm isle, Zara redirected Draven's lightning back at him, disabling his ship."],
        ["A Twist Revealed", "Draven was Zara's father, estranged after choosing piracy over family, now seeking redemption through power."],
        ["The Heartfelt Choice", "Zara offered Draven a chance to join her crew, using the compass to show him the skies' beauty, not just power."],
        ["Draven's Change", "Moved, Draven surrendered, vowing to help Zara free the sky cities, starting with a trade hub he once controlled."],
        ["The Sky's Freedom", "Zara used the compass to clear storms, opening safe routes for sky ships, uniting cities in peace."],
        ["The Crew's Celebration", "The Nimbus crew threw a sky party, with sky parrots joining, their squawks adding to the festive chaos."],
        ["The Compass's Secret", "The compass whispered to Zara, revealing it could also calm hearts, helping her heal old crew wounds."],
        ["A New Ally", "A young sky pirate, inspired by Zara, joined the Nimbus, bringing a map to a hidden sky city needing aid."],
        ["The Temple's Gift", "The wind priests gifted Zara a wind charm, enhancing the compass's precision for delicate maneuvers."],
        ["Draven's Role", "Draven became the Nimbus's navigator, his experience guiding Zara through treacherous cloud canyons."],
        ["The Sky's Song", "The compass began to hum, its melody guiding Zara to skies where lost ships needed rescue."],
        ["A Child's Dream", "A child from a sky city dreamed of flying with Zara, inspiring her to start a sky school for young pilots."],
        ["The Isles' Unity", "The Isles of Mist united under Zara's leadership, their winds now flowing in harmony thanks to the compass."],
        ["The Storm's Memory", "The storm isle shared memories of ancient sky pirates, teaching Zara old techniques for wind navigation."],
        ["A Twist of Fate", "Zara found a second compass in Draven's old ship, hinting at a twin device that could control oceans too."],
        ["The Crew's Bond", "Zara's crew grew closer, their loyalty stronger than any storm, ready for any adventure the skies offered."],
        ["The Sky's Heart", "Zara felt the sky's pulse through the compass, its rhythm guiding her to protect its freedom forever."],
        ["A Funny Incident", "Zara once summoned a breeze that turned a rival's ship upside down, leaving its crew laughing in embarrassment."],
        ["The Temple's Trust", "The wind priests named Zara their sky guardian, entrusting her with protecting all air currents."],
        ["The Compass's Legacy", "Zara began training her crew to use the compass, ensuring its power would always serve the skies."],
        ["A New Journey", "The compass pointed to a distant sky realm, whispering of a lost city needing Zara's help."],
        ["The Sky's Peace", "Zara's efforts brought peace to the skies, her name a legend among cloud-dwellers and storm-riders."],
        ["Draven's Redemption", "Draven rebuilt a sky orphanage, dedicating it to Zara, his heart healed by her forgiveness."],
        ["The Crew's Future", "The Nimbus crew planned a new expedition, their ship ready for uncharted skies and new stories."],
        ["The Child's Flight", "The young pilot flew beside Zara, her small ship glowing with pride, guided by the compass's light."],
        ["The Isles' Song", "The Isles of Mist sang a wind song, its melody a tribute to Zara's courage and leadership."],
        ["The Compass's Gift", "The compass revealed a map of emotional winds, helping Zara guide lost souls to peace."],
        ["The Sky's Guardian", "Zara swore to protect the skies, her heart tied to the compass, a beacon for all skyfarers."],
        ["A Twist in the Clouds", "A cloud revealed a hidden message, hinting at a sky war Zara needed to prevent with the compass."],
        ["The Crew's Oath", "The crew swore loyalty to Zara, their bond stronger than any storm, ready for eternal adventures."],
        ["The Final Scene", "Zara stood on the Nimbus's deck, compass glowing, ready to sail into the next sky, her heart soaring with freedom."],
      ]
    },
    {
      title: "The Dream Painter",
      desc: "An artist paints dreams that come to life, changing fates.",
      color: "from-pink-400 to-purple-600",
      totalPages: 50,
      pages: [
        ["The Studio of Dreams", "In a vibrant Parisian attic, Lila painted dreams on enchanted canvases, each stroke bringing hopes to life."],
        ["The Magic Brush", "Lila inherited a brush that could paint reality, its bristles glowing with the colors of human emotions."],
        ["The First Painting", "Lila painted a child's dream of flying, and the next morning, the child soared over Paris in a hot air balloon."],
        ["A Desperate Request", "A woman, Marie, begged Lila to paint her lost love's return, her tears mixing with the canvas's colors."],
        ["The Brush's Rules", "The brush whispered to Lila: only pure dreams could be painted, or the canvas would twist reality into chaos."],
        ["A Rival Artist", "Victor, a jealous painter, stole a canvas, hoping to paint his own fame, unaware of the brush's dangerous power."],
        ["The Twisted Painting", "Victor's painting went wrong, unleashing a nightmare creature that roamed Paris, feeding on fear."],
        ["Lila's Mission", "Lila vowed to stop the creature, painting a dream of courage to trap it, her brush glowing fiercely."],
        ["A Funny Mishap", "Lila accidentally painted a clown that juggled stars, delighting Parisians but distracting her from the mission."],
        ["The Dream Council", "Lila met the Dream Council, ancient artists who guarded the brush's power, meeting in a painted dreamscape."],
        ["The Council's Warning", "The Council warned that Victor's actions could unravel reality, and only Lila's heart could restore balance."],
        ["The Creature's Lair", "Lila tracked the creature to a painted forest, its trees alive with fear, her brush trembling in her hand."],
        ["Marie's Hope", "Marie joined Lila, her faith in love strengthening Lila's paintings, creating a beacon of light in the dark forest."],
        ["The Brush's Secret", "The brush revealed it could paint emotions, letting Lila create a canvas of peace to calm the creature."],
        ["Victor's Betrayal", "Victor ambushed Lila, stealing the brush, but his paintings only created more chaos, his heart too greedy."],
        ["A Twist Revealed", "Victor was Lila's brother, separated at birth, his jealousy born from feeling abandoned by their artist parents."],
        ["The Climax", "Lila faced Victor in the dreamscape, painting a memory of their childhood, softening his heart with shared love."],
        ["Restoring Reality", "With Marie's help, Lila painted a new reality, trapping the creature in a canvas of eternal peace."],
        ["Victor's Redemption", "Victor returned the brush, vowing to paint only for good, his heart healed by Lila's forgiveness."],
        ["The Council's Gift", "The Council gave Lila a new canvas, one that could paint futures, helping her guide lost dreamers."],
        ["Marie's Reunion", "Lila painted Marie's love returning, and the next day, he appeared in Paris, their embrace glowing with joy."],
        ["A New Dreamer", "A young boy asked Lila to paint his dream of being a hero, starting her next adventure in the dreamscape."],
        ["The Studio's Light", "Lila's attic glowed brighter, its walls now alive with paintings that whispered stories of hope."],
        ["The Brush's Song", "The brush began to hum, its melody guiding Lila to paint dreams that healed broken hearts."],
        ["A Funny Incident", "Lila painted a dancing bear that escaped, performing in a Paris square, making children laugh."],
        ["The Council's Trust", "The Council named Lila their chief painter, her canvases now guiding dreamers across the world."],
        ["Marie's Gratitude", "Marie gifted Lila a locket, its colors changing with Lila's emotions, a reminder of their bond."],
        ["The Creature's Peace", "The trapped creature became a guardian in Lila's paintings, protecting her dreamscape from chaos."],
        ["The Boy's Heroism", "The boy’s painted hero came to life, saving a lost dog, proving Lila's power to change fates."],
        ["The Studio's Secret", "Lila discovered her attic was a dream nexus, connecting all dreamers to her canvases."],
        ["Victor's Role", "Victor joined Lila, painting alongside her, his canvases now full of hope and redemption."],
        ["The Dreamscape's Growth", "The dreamscape expanded, new canvases appearing for dreams yet to be painted."],
        ["A Twist of Fate", "Lila found a canvas showing her as a child painting the brush, hinting she created its magic long ago."],
        ["The Council's Vision", "The Council foresaw a dream storm, asking Lila to paint a shield of peace to protect dreamers."],
        ["The Brush's Legacy", "Lila began training young painters, passing the brush's secrets to those with kind hearts."],
        ["The Boy's Growth", "The young boy painted his own hero, his canvas glowing with pride, guided by Lila’s teachings."],
        ["The Studio's Song", "The attic sang a lullaby, its melody soothing Lila as she painted new dreams."],
        ["Marie's Future", "Marie’s love proposed, their wedding painted by Lila, a canvas of eternal joy."],
        ["The Creature's Gift", "The creature gifted Lila a spark of its light, enhancing her brush’s ability to paint hope."],
        ["Victor's Peace", "Victor found peace, his paintings now healing broken dreams, a true partner to Lila."],
        ["The Dreamscape's Heart", "Lila felt the dreamscape’s pulse, her paintings syncing with its rhythm to guide dreamers."],
        ["A New Dream", "A girl asked Lila to paint a dream of adventure, starting a new journey in the dreamscape."],
        ["The Council's Honor", "The Council named Lila the Dream Weaver, her name painted in starlight across dreams."],
        ["The Studio's Future", "The attic prepared for new canvases, its light ready to guide Lila to uncharted dreams."],
        ["The Boy's Destiny", "The young boy became Lila’s apprentice, his hero paintings inspiring others to dream big."],
        ["The Brush’s Final Gift", "The brush revealed a canvas of Lila’s future, showing her as the eternal painter of hope."],
        ["A Funny Incident", "Lila painted a singing bird that escaped, serenading Paris with off-key tunes, to everyone’s delight."],
        ["The Dreamscape’s Peace", "Lila’s paintings brought peace to the dreamscape, her canvases a beacon for all dreamers."],
        ["The Final Scene", "Lila stood in her attic, brush in hand, painting a new dream, her heart glowing with the colors of hope."],
      ]
    },
    {
      title: "The Moonlit Detective",
      desc: "A detective solves crimes in a city where shadows come alive.",
      color: "from-gray-400 to-blue-600",
      totalPages: 50,
      pages: [
        ["The Shadow City", "In Nocturne, a city where shadows had minds, Detective Lila Crane solved crimes under the moon’s eerie glow."],
        ["The First Case", "A merchant’s shadow was stolen, leaving him lifeless. Lila found a clue: a silver thread glowing with moonlight."],
        ["The Shadow Market", "Lila traced the thread to a hidden market where shadows were traded, guarded by a figure called the Shade King."],
        ["A Dangerous Deal", "The Shade King offered Lila a deal: find his lost shadow in exchange for the merchant’s, but time was running out."],
        ["The Moon’s Secret", "Lila discovered the moon’s light powered Nocturne’s shadows, and someone was draining it to control the city."],
        ["A New Ally", "A shadow named Flicker, once a thief, joined Lila, its loyalty wavering but drawn to her fearless heart."],
        ["The Shade King’s Trap", "The Shade King lured Lila into a shadow maze, where walls shifted, trapping her in a loop of her own fears."],
        ["Flicker’s Courage", "Flicker guided Lila out, revealing it was the merchant’s shadow, seeking redemption for past crimes."],
        ["A Funny Mishap", "Lila’s flashlight turned a shadow into a dancing clown, causing a market riot as it juggled moonbeams."],
        ["The Moon’s Guardian", "Lila met the Moon Guardian, an ancient shadow who protected the city’s light, but was weakening."],
        ["The Thief Revealed", "The Shade King was draining the moon to create a shadow army, aiming to rule Nocturne’s nights."],
        ["Lila’s Plan", "Lila devised a plan to restore the moon’s light, using Flicker to infiltrate the Shade King’s shadow fortress."],
        ["The Fortress Breach", "Flicker led Lila through shadow tunnels, her flashlight now a weapon that could bind rogue shadows."],
        ["A Twist Revealed", "The Shade King was Lila’s old partner, presumed dead, now corrupted by shadow power, seeking revenge."],
        ["The Climax", "In the fortress’s core, Lila faced her partner, using the moon’s light to free his shadow, restoring his heart."],
        ["Restoring the Moon", "Lila and Flicker channeled the moon’s light back to Nocturne, reviving the city’s vibrant shadows."],
        ["Flicker’s Freedom", "Flicker, now free, chose to stay with Lila, becoming her shadow partner in solving Nocturne’s mysteries."],
        ["The Guardian’s Gift", "The Moon Guardian gave Lila a moonstone, enhancing her ability to see shadows’ true intents."],
        ["A New Case", "A child’s shadow went missing, leading Lila to a shadow circus where dreams were being stolen."],
        ["The City’s Heart", "Lila found Nocturne’s heart, a glowing crystal that pulsed with the city’s emotions, guiding her cases."],
        ["The Partner’s Redemption", "Lila’s partner joined her, atoning for his past by helping protect the city’s shadows."],
        ["A Funny Incident", "Lila accidentally bound a shadow into a singing fish, delighting Nocturne’s kids with its tunes."],
        ["The Moon’s Song", "The moon began to hum, its melody guiding Lila to shadows needing her help."],
        ["The Circus Mystery", "Lila solved the circus case, freeing the child’s shadow, which became a playful puppy shadow."],
        ["The Guardian’s Trust", "The Moon Guardian named Lila the Shadow Keeper, her flashlight now a city legend."],
        ["Flicker’s Growth", "Flicker grew stronger, its light helping Lila navigate the darkest corners of Nocturne."],
        ["The City’s Peace", "Lila restored peace to Nocturne, its shadows dancing freely under the moon’s glow."],
        ["A New Ally", "A young shadow detective joined Lila, eager to learn her ways, her flashlight glowing with hope."],
        ["The Moonstone’s Secret", "The moonstone revealed visions of future crimes, helping Lila prevent shadow thefts."],
        ["The Partner’s Role", "Lila’s partner became her equal, their teamwork making Nocturne safer than ever."],
        ["The City’s Song", "Nocturne sang a lullaby, its shadows harmonizing with Lila’s heart, guiding her cases."],
        ["A Twist of Fate", "Lila found a shadow of herself, hinting she was part shadow, born to protect Nocturne."],
        ["The Guardian’s Vision", "The Moon Guardian foresaw a shadow war, asking Lila to prepare with her moonstone."],
        ["Flicker’s Destiny", "Flicker became a guardian shadow, its light protecting Nocturne alongside Lila."],
        ["The Child’s Gratitude", "The child gifted Lila a shadow drawing, a heartfelt thank-you for saving her dream."],
        ["The Moon’s Legacy", "Lila began training shadow detectives, passing the moonstone’s secrets to pure hearts."],
        ["A New Mystery", "A shadow ship appeared in Nocturne’s skies, hinting at a new adventure for Lila."],
        ["The City’s Future", "Nocturne glowed brighter, its shadows safe under Lila’s watchful care."],
        ["The Partner’s Peace", "Lila’s partner found peace, his shadow now a beacon of hope in Nocturne."],
        ["The Moonstone’s Gift", "The moonstone enhanced Lila’s flashlight, letting her bind shadows with love."],
        ["Flicker’s Song", "Flicker sang with the moon, its melody soothing Nocturne’s restless shadows."],
        ["The Child’s Dream", "The child dreamed of joining Lila, her puppy shadow training to be a detective."],
        ["The Guardian’s Honor", "The Moon Guardian named Lila the Eternal Shadow Keeper, her name etched in moonlight."],
        ["A Funny Incident", "Lila bound a shadow into a dancing cat, amusing Nocturne’s citizens with its antics."],
        ["The Shadow Ship’s Call", "The shadow ship signaled a distant city needing Lila’s help, starting a new journey."],
        ["The City’s Oath", "Lila swore to protect Nocturne’s shadows, her heart tied to the moon’s light."],
        ["The Moon’s Future", "The moon glowed brighter, ready to guide Lila through Nocturne’s next mysteries."],
        ["The Final Scene", "Lila stood under the moon, flashlight glowing, ready to solve Nocturne’s next shadow case."],
      ]
    },
    {
      title: "The Crystal Alchemist",
      desc: "An alchemist seeks a crystal that can heal broken worlds.",
      color: "from-emerald-400 to-teal-600",
      totalPages: 50,
      pages: [
        ["The Alchemist’s Lab", "In a hidden valley, alchemist Elara worked in her crystal-lit lab, crafting potions that mended broken hearts and worlds."],
        ["The Shattered Crystal", "Elara found a prophecy about the Heart Crystal, a gem that could heal entire worlds, hidden in a cursed forest."],
        ["The First Step", "Guided by an ancient scroll, Elara ventured into the forest, where trees whispered warnings of a dark alchemist, Varn."],
        ["The Forest’s Guardian", "A crystal wolf guarded the forest’s entrance, demanding Elara prove her heart’s purity before entering."],
        ["A Clever Test", "Elara offered the wolf a potion of truth, revealing her intent to heal, earning its trust and a crystal shard."],
        ["Varn’s Shadow", "Varn, the dark alchemist, sent crystal golems to steal Elara’s shard, his eyes glowing with greed for the Heart Crystal."],
        ["A Daring Escape", "Elara used a potion of speed to outrun the golems, her lab’s crystals glowing to guide her through the dark forest."],
        ["The Crystal Cave", "The shard led Elara to a cave where crystals sang, each note revealing a piece of the Heart Crystal’s location."],
        ["The Cave’s Trial", "Elara faced a trial of balance, mixing potions to calm the cave’s chaotic crystal energies, her hands steady."],
        ["The Second Shard", "The cave gifted Elara the second shard, warning that Varn was corrupting crystals to build a world-destroying weapon."],
        ["Varn’s Plan", "Varn revealed he sought the Heart Crystal to shatter worlds, creating a new one where he ruled as a god."],
        ["A Funny Mishap", "Elara’s potion misfired, turning a golem into a sparkling puppy, which chased its own tail, amusing the forest."],
        ["The Crystal Council", "Elara met the Crystal Council, ancient gems who guarded the Heart Crystal’s secrets, meeting in a radiant cavern."],
        ["The Council’s Warning", "The Council warned that Varn’s corruption could fracture reality, and only Elara’s potions could stop him."],
        ["The Third Shard", "Elara found the third shard in a crystal lake, guarded by a water spirit who tested her empathy with riddles."],
        ["Varn’s Trap", "Varn trapped Elara in a crystal maze, its walls reflecting her fears, but her potions dissolved the illusions."],
        ["A Twist Revealed", "Varn was Elara’s mentor, banished for his greed, now seeking revenge by claiming the Heart Crystal’s power."],
        ["The Climax", "In the crystal cavern’s heart, Elara faced Varn, using a potion of harmony to cleanse his corrupted crystals."],
        ["Restoring the Crystal", "Elara united the shards, forming the Heart Crystal, its light healing the forest and weakening Varn’s power."],
        ["Varn’s Redemption", "Elara offered Varn a potion of forgiveness, cleansing his heart, turning him into an ally for healing worlds."],
        ["The Council’s Gift", "The Council gave Elara a crystal vial, enhancing her potions to heal emotional wounds across dimensions."],
        ["A New Quest", "A village sent a plea for Elara to heal their dying land, starting her next adventure with the Heart Crystal."],
        ["The Lab’s Light", "Elara’s lab glowed brighter, its crystals singing with pride for her courage and wisdom."],
        ["The Wolf’s Loyalty", "The crystal wolf joined Elara, its light guiding her through dark forests and dangerous quests."],
        ["A Funny Incident", "Elara’s potion turned a tree into a singing bush, its melodies cheering the village she saved."],
        ["The Council’s Trust", "The Council named Elara the Crystal Guardian, her potions now legendary among alchemists."],
        ["Varn’s Role", "Varn became Elara’s assistant, his knowledge helping her craft new potions for world-healing."],
        ["The Crystal’s Song", "The Heart Crystal sang, its melody guiding Elara to worlds needing her alchemical touch."],
        ["The Village’s Hope", "Elara healed the village’s land, its crops blooming under the Heart Crystal’s light, a vibrant miracle."],
        ["The Wolf’s Growth", "The crystal wolf grew stronger, its light protecting Elara from rogue alchemists seeking her power."],
        ["The Lab’s Secret", "Elara discovered her lab was a crystal nexus, amplifying her potions’ effects across realities."],
        ["A New Ally", "A young alchemist joined Elara, eager to learn her ways, her potions glowing with potential."],
        ["The Crystal’s Vision", "The Heart Crystal showed Elara visions of broken worlds, guiding her to her next mission."],
        ["Varn’s Peace", "Varn found peace, his potions now healing hearts, a testament to Elara’s forgiveness."],
        ["The Village’s Gratitude", "The village gifted Elara a crystal flower, its petals glowing with their thanks."],
        ["The Council’s Vision", "The Council foresaw a crystal storm, asking Elara to prepare potions to protect worlds."],
        ["The Wolf’s Destiny", "The crystal wolf became a guardian, its light a beacon for Elara’s quests."],
        ["The Lab’s Song", "Elara’s lab sang a lullaby, its crystals soothing her as she crafted new potions."],
        ["A New World", "A distant world signaled Elara, its crystals dimming, needing her healing touch."],
        ["The Crystal’s Legacy", "Elara began training alchemists, passing the Heart Crystal’s secrets to pure hearts."],
        ["The Village’s Future", "The village thrived, its people now alchemists under Elara’s guidance, healing their land."],
        ["A Twist of Fate", "Elara found a crystal showing her as its creator, hinting she was destined to wield its power."],
        ["The Council’s Honor", "The Council named Elara the Eternal Alchemist, her name etched in crystal light."],
        ["The Wolf’s Gift", "The wolf gifted Elara a crystal claw, enhancing her potions’ precision and power."],
        ["The Lab’s Future", "Elara’s lab prepared for new quests, its crystals ready to guide her to broken worlds."],
        ["A Funny Incident", "Elara’s potion turned a rock into a dancing gem, amusing the village children."],
        ["The Crystal’s Peace", "Elara’s potions brought peace to worlds, her Heart Crystal a beacon of hope."],
        ["The Final Scene", "Elara stood in her lab, Heart Crystal glowing, ready to heal the next world with her alchemical magic."],
      ]
    },
    {
      title: "The Songweaver’s Harp",
      desc: "A bard uses a magical harp to heal broken hearts.",
      color: "from-rose-400 to-pink-600",
      totalPages: 50,
      pages: [
        ["The Wandering Bard", "In a medieval realm, bard Elowen wandered with her enchanted harp, its strings weaving songs that healed hearts."],
        ["The Broken Village", "Elowen arrived in a village where sorrow reigned, hearts broken by a curse that silenced their joy."],
        ["The Harp’s Power", "Elowen’s harp glowed, its melody lifting the curse’s weight, making children smile for the first time in years."],
        ["A Dark Song", "A shadow bard, Varkis, appeared, his music twisting hearts, aiming to spread despair with a cursed lute."],
        ["The First Note", "Elowen played a song of hope, countering Varkis’s darkness, her harp’s strings shimmering with light."],
        ["The Village’s Plea", "The villagers begged Elowen to find the Songheart, a mythical gem that could amplify her harp’s healing power."],
        ["The Forest Path", "Elowen ventured into an enchanted forest, guided by her harp’s melody, which sang of the Songheart’s location."],
        ["A Clever Disguise", "Varkis ambushed Elowen, but she disguised herself as a merchant, her harp hidden in a sack, fooling him."],
        ["A Funny Mishap", "Elowen’s harp accidentally played a jig, making forest animals dance, causing a hilarious stampede."],
        ["The Songheart’s Guardian", "A forest spirit guarded the Songheart, demanding Elowen sing a song of pure love to prove her worth."],
        ["The Spirit’s Test", "Elowen sang of her lost family, her voice trembling, moving the spirit to tears, granting her the gem."],
        ["Varkis’s Plan", "Varkis revealed he sought the Songheart to enslave hearts, his lute now a weapon of despair."],
        ["The Village’s Hope", "Elowen returned, the Songheart amplifying her harp, her songs now lifting entire crowds to joy."],
        ["A Twist Revealed", "Varkis was Elowen’s brother, cursed by a witch to spread sorrow, his heart yearning for freedom."],
        ["The Climax", "In the village square, Elowen faced Varkis, her harp’s song cleansing his lute, freeing his heart."],
        ["Restoring Joy", "Elowen used the Songheart to heal the village, its people singing with her, their hearts whole again."],
        ["Varkis’s Redemption", "Varkis joined Elowen, his lute now playing songs of hope, a partner in her mission."],
        ["The Spirit’s Gift", "The forest spirit gave Elowen a string of starlight, enhancing her harp’s ability to heal."],
        ["A New Village", "A distant village sent a plea, their hearts broken by war, needing Elowen’s songs."],
        ["The Harp’s Light", "Elowen’s harp glowed brighter, its strings now alive with the village’s healed emotions."],
        ["Varkis’s Role", "Varkis became Elowen’s harmony, his lute blending with her harp, doubling their healing power."],
        ["The Songheart’s Song", "The Songheart sang, its melody guiding Elowen to hearts needing her music."],
        ["A Funny Incident", "Elowen’s song turned a grumpy old man into a dancing fool, amusing the village children."],
        ["The Spirit’s Trust", "The forest spirit named Elowen the Songweaver, her harp a legend among bards."],
        ["The Village’s Gratitude", "The village gifted Elowen a locket, its melody echoing her harp’s songs."],
        ["Varkis’s Peace", "Varkis found peace, his lute now a beacon of hope, thanks to Elowen’s love."],
        ["The Harp’s Legacy", "Elowen began training young bards, passing the Songheart’s secrets to kind hearts."],
        ["A New Song", "A child asked Elowen to sing a song of adventure, starting a new journey for her harp."],
        ["The Forest’s Song", "The forest sang with Elowen, its melody a tribute to her healing power."],
        ["The Songheart’s Vision", "The Songheart showed Elowen visions of broken hearts, guiding her to new villages."],
        ["Varkis’s Gift", "Varkis crafted a new string for Elowen’s harp, enhancing its emotional reach."],
        ["The Village’s Future", "The village thrived, its people now bards under Elowen’s guidance, singing joy."],
        ["A Twist of Fate", "Elowen found a song showing her as the Songheart’s creator, destined to wield its power."],
        ["The Spirit’s Honor", "The forest spirit named Elowen the Eternal Songweaver, her name sung in starlight."],
        ["The Harp’s Future", "Elowen’s harp prepared for new songs, its strings ready to heal more hearts."],
        ["The Child’s Dream", "The child sang with Elowen, her voice glowing with hope, guided by the harp."],
        ["The Forest’s Gift", "The forest gave Elowen a leaf that sang, enhancing her harp’s melodies."],
        ["Varkis’s Destiny", "Varkis became a guardian bard, his lute protecting villages alongside Elowen."],
        ["The Songheart’s Peace", "Elowen’s songs brought peace to the realm, her harp a beacon of love."],
        ["A New Village", "A distant village signaled Elowen, its hearts needing her healing songs."],
        ["The Harp’s Oath", "Elowen swore to heal all hearts, her harp tied to the Songheart’s light."],
        ["The Village’s Song", "The village sang with Elowen, their voices a chorus of eternal joy."],
        ["The Child’s Growth", "The child became Elowen’s apprentice, her songs glowing with potential."],
        ["The Forest’s Future", "The forest glowed brighter, ready to guide Elowen to new villages."],
        ["A Funny Incident", "Elowen’s song turned a cow into a singer, its moos amusing the village."],
        ["The Songheart’s Gift", "The Songheart enhanced Elowen’s harp, letting her sing emotions into reality."],
        ["Varkis’s Future", "Varkis vowed to sing with Elowen, their music a bond of eternal hope."],
        ["The Final Scene", "Elowen stood in the village, harp glowing, ready to sing the next song of healing."],
      ]
    },
    {
      title: "The Time Weaver’s Loom",
      desc: "A weaver creates tapestries that alter the fabric of time.",
      color: "from-blue-400 to-indigo-600",
      totalPages: 50,
      pages: [
        ["The Loom’s Chamber", "In a mountain sanctuary, weaver Aria crafted tapestries on a magical loom that wove the threads of time."],
        ["The Frayed Thread", "Aria found a tapestry fraying, its threads unraveling time, causing history to flicker in her village."],
        ["The First Stitch", "Aria wove a new thread, stabilizing the village, but the loom whispered of a greater threat to time itself."],
        ["A Shadow Weaver", "A dark weaver, Silas, sought the loom to rewrite history, his own tapestries twisted with greed."],
        ["The Loom’s Guardian", "A spirit of time, Chrona, guarded the loom, testing Aria’s heart to ensure she wove with love."],
        ["A Clever Disguise", "Aria posed as a merchant to infiltrate Silas’s camp, her tapestry hidden, seeking his plans."],
        ["A Funny Mishap", "Aria’s thread turned a horse into a time-jumping pony, galloping through eras, amusing villagers."],
        ["The Time Vault", "Chrona led Aria to a vault where time threads were stored, each glowing with moments of history."],
        ["Silas’s Plan", "Silas planned to unravel the loom’s core thread, collapsing time to create a world where he ruled."],
        ["The Vault’s Trial", "Aria faced a trial of weaving, stitching moments of joy to prove her worth to Chrona."],
        ["The Second Thread", "Chrona gave Aria a golden thread, enhancing the loom’s power to mend broken timelines."],
        ["Silas’s Trap", "Silas trapped Aria in a time loop, reliving a single day, but her tapestry broke the cycle."],
        ["A Twist Revealed", "Silas was Aria’s father, lost to time’s chaos, now seeking power to reclaim his lost years."],
        ["The Climax", "In the loom’s chamber, Aria faced Silas, weaving a tapestry of their shared past to heal his heart."],
        ["Restoring Time", "Aria wove the golden thread, mending time’s fabric, restoring history to its proper flow."],
        ["Silas’s Redemption", "Silas joined Aria, his weaving now mending broken moments, a partner in her mission."],
        ["Chrona’s Gift", "Chrona gave Aria a time needle, enhancing her ability to weave precise moments."],
        ["A New Village", "A village signaled Aria, its history fraying, needing her loom’s healing touch."],
        ["The Loom’s Light", "The loom glowed brighter, its threads singing with Aria’s love for time."],
        ["Silas’s Role", "Silas became Aria’s guide, his knowledge helping her weave complex timelines."],
        ["The Thread’s Song", "The golden thread sang, guiding Aria to moments needing her weaving."],
        ["The Village’s Hope", "Aria mended the village’s history, its people thriving in a restored timeline."],
        ["A Funny Incident", "Aria’s thread turned a clock into a singing bird, delighting the village children."],
        ["Chrona’s Trust", "Chrona named Aria the Time Weaver, her loom a legend among timekeepers."],
        ["Silas’s Peace", "Silas found peace, his tapestries now weaving hope, thanks to Aria’s love."],
        ["The Village’s Gratitude", "The village gifted Aria a time locket, its ticking echoing her loom’s rhythm."],
        ["The Loom’s Legacy", "Aria began training weavers, passing the loom’s secrets to pure hearts."],
        ["A New Moment", "A child asked Aria to weave a moment of adventure, starting a new journey."],
        ["The Vault’s Song", "The time vault sang, its melody guiding Aria to broken timelines."],
        ["Chrona’s Vision", "Chrona foresaw a time storm, asking Aria to weave a shield of moments."],
        ["Silas’s Gift", "Silas crafted a new thread for Aria, enhancing her loom’s emotional reach."],
        ["The Village’s Future", "The village thrived, its people now weavers under Aria’s guidance."],
        ["A Twist of Fate", "Aria found a tapestry showing her as the loom’s creator, destined to wield its power."],
        ["Chrona’s Honor", "Chrona named Aria the Eternal Weaver, her name woven in starlight."],
        ["The Loom’s Future", "The loom prepared for new tapestries, its threads ready to mend time."],
        ["The Child’s Dream", "The child wove with Aria, her moment glowing with hope, guided by the loom."],
        ["The Vault’s Gift", "The vault gave Aria a time crystal, enhancing her tapestries’ precision."],
        ["Silas’s Destiny", "Silas became a guardian weaver, his tapestries protecting time alongside Aria."],
        ["The Thread’s Peace", "Aria’s tapestries brought peace to time, her loom a beacon of love."],
        ["A New Village", "A distant village signaled Aria, its history needing her weaving."],
        ["The Loom’s Oath", "Aria swore to mend all time, her heart tied to the loom’s light."],
        ["The Village’s Song", "The village sang with Aria, their moments a chorus of eternal joy."],
        ["The Child’s Growth", "The child became Aria’s apprentice, her tapestries glowing with potential."],
        ["The Vault’s Future", "The vault glowed brighter, ready to guide Aria to new timelines."],
        ["A Funny Incident", "Aria’s thread turned a rock into a dancing stone, amusing the village."],
        ["The Thread’s Gift", "The golden thread enhanced Aria’s loom, letting her weave emotions into time."],
        ["Silas’s Future", "Silas vowed to weave with Aria, their tapestries a bond of eternal hope."],
        ["The Final Scene", "Aria stood at her loom, golden thread glowing, ready to weave the next moment of time."],
      ]
    },
    {
      title: "The Starborn Thief",
      desc: "A thief steals stars to save her dying planet.",
      color: "from-purple-400 to-blue-600",
      totalPages: 50,
      pages: [
        ["The Dying Planet", "On a fading planet, thief Kael stole stars to power her world, her heart torn between duty and guilt."],
        ["The Star Vault", "Kael found a map to the Star Vault, a cosmic treasury holding the universe’s brightest stars."],
        ["The First Heist", "Kael infiltrated the vault, dodging light traps, stealing a star that glowed with hope for her planet."],
        ["The Star Keeper", "The vault’s guardian, Astra, caught Kael, demanding she return the star or face cosmic judgment."],
        ["A Desperate Plea", "Kael revealed her planet’s plight, her tears swaying Astra, who offered a deal: find a rogue star to replace it."],
        ["The Rogue Star", "Kael tracked the rogue star to a nebula, its light unstable, threatening to destroy nearby worlds."],
        ["A Rival Thief", "Another thief, Vex, sought the rogue star, aiming to sell it for power, his ship armed with shadow nets."],
        ["A Daring Chase", "Kael outmaneuvered Vex in a nebula storm, her ship dancing through clouds of stardust."],
        ["A Funny Mishap", "Kael’s net caught a comet instead of the star, its tail tickling her ship, making her laugh."],
        ["The Star’s Song", "The rogue star sang to Kael, its melody revealing its pain, lost from its constellation home."],
        ["Astra’s Guidance", "Astra taught Kael to listen to stars, their emotions guiding her to capture them without harm."],
        ["Vex’s Trap", "Vex trapped Kael in a gravity well, but her star’s light broke the trap, freeing her ship."],
        ["A Twist Revealed", "Vex was Kael’s brother, separated by war, now stealing stars to save his own hidden planet."],
        ["The Climax", "Kael faced Vex in the nebula, using the rogue star’s song to calm his heart, uniting their goals."],
        ["Restoring the Star", "Kael returned the rogue star to its constellation, its light stabilizing, saving nearby worlds."],
        ["Vex’s Redemption", "Vex joined Kael, his skills helping her steal only stars that wouldn’t harm the cosmos."],
        ["Astra’s Gift", "Astra gave Kael a star locket, enhancing her ability to hear stars’ emotions."],
        ["A New Planet", "A distant planet signaled Kael, its light fading, needing her stolen stars."],
        ["The Vault’s Light", "The Star Vault glowed brighter, its stars proud of Kael’s selfless mission."],
        ["Vex’s Role", "Vex became Kael’s partner, his nets now catching stars with care, guided by her heart."],
        ["The Star’s Legacy", "The rogue star’s song guided Kael to other lost stars needing her help."],
        ["The Planet’s Hope", "Kael’s stolen stars revived her planet, its skies glowing with new light."],
        ["A Funny Incident", "Kael’s net caught a star that giggled, its light tickling her crew, causing chaos."],
        ["Astra’s Trust", "Astra named Kael the Star Guardian, her locket a legend among cosmic thieves."],
        ["Vex’s Peace", "Vex found peace, his nets now weaving hope, thanks to Kael’s love."],
        ["The Planet’s Gratitude", "Kael’s planet gifted her a star crown, its light echoing her courage."],
        ["The Vault’s Song", "The Star Vault sang, its melody guiding Kael to stars needing her touch."],
        ["A New Star", "A child asked Kael to steal a star for her dream, starting a new adventure."],
        ["The Constellation’s Gift", "The rogue star’s constellation gave Kael a light thread, enhancing her nets."],
        ["Vex’s Destiny", "Vex became a guardian thief, his nets protecting stars alongside Kael."],
        ["The Planet’s Future", "Kael’s planet thrived, its people now starweavers under her guidance."],
        ["A Twist of Fate", "Kael found a star showing her as its creator, destined to wield its light."],
        ["Astra’s Honor", "Astra named Kael the Eternal Starborn, her name shining in the cosmos."],
        ["The Vault’s Future", "The Star Vault prepared for new heists, its stars ready to guide Kael."],
        ["The Child’s Dream", "The child wove a star with Kael, her light glowing with hope."],
        ["The Constellation’s Song", "The constellation sang, its melody a tribute to Kael’s courage."],
        ["Vex’s Gift", "Vex crafted a new net for Kael, enhancing her ability to catch stars gently."],
        ["The Planet’s Song", "Kael’s planet sang, its skies a chorus of eternal light."],
        ["The Child’s Growth", "The child became Kael’s apprentice, her nets glowing with potential."],
        ["The Vault’s Peace", "Kael’s heists brought peace to the cosmos, her stars a beacon of hope."],
        ["A New Planet", "A distant planet signaled Kael, its stars needing her touch."],
        ["The Star’s Oath", "Kael swore to protect all stars, her heart tied to the locket’s light."],
        ["The Constellation’s Future", "The constellation glowed brighter, ready to guide Kael to new stars."],
        ["A Funny Incident", "Kael’s net caught a star that danced, amusing her crew with its twirls."],
        ["The Vault’s Gift", "The Star Vault enhanced Kael’s locket, letting her weave starlight into reality."],
        ["Vex’s Future", "Vex vowed to steal with Kael, their nets a bond of eternal hope."],
        ["The Final Scene", "Kael stood in the Star Vault, locket glowing, ready to steal the next star for her planet."],
      ]
    },
     {
      title: "The Ghost Ship’s Captain",
      desc: "A captain sails a haunted ship to find lost souls.",
      color: "from-blue-400 to-gray-600",
      totalPages: 50,
      pages: [
        ["The Phantom Sea", "Captain Eryn sailed the Wraith, a ghost ship that roamed misty seas, seeking lost souls to guide home."],
        ["The Lost Crew", "Eryn found a logbook listing a crew trapped in a cursed storm, their souls bound to the sea."],
        ["The First Soul", "Eryn sailed into the storm, finding a sailor’s soul, its light flickering, begging for release."],
        ["The Sea Witch", "A witch, Morna, appeared, claiming the souls as her own, her magic tying them to the storm."],
        ["A Desperate Plea", "Eryn pleaded with Morna, offering her own courage in exchange for the sailor’s soul, her heart steady despite the witch’s chilling gaze."],
        ["The Witch’s Riddle", "Morna, amused, posed a riddle about the sea’s deepest secret, testing Eryn’s knowledge of the ocean’s mysteries."],
        ["A Clever Answer", "Eryn answered with a tale of a sunken city, its bells still ringing, earning Morna’s respect and the sailor’s freedom."],
        ["The Logbook’s Clue", "The freed sailor’s soul revealed the logbook held a map to the Stormheart, a gem that could break Morna’s curse."],
        ["A Rival Captain", "Captain Silas, a ruthless ghost hunter, intercepted Eryn, seeking the Stormheart to control all lost souls for profit."],
        ["A Daring Escape", "Eryn steered the Wraith through a fog bank, her ship’s ghostly sails outpacing Silas’s ironclad vessel."],
        ["A Funny Mishap", "Eryn’s lantern flickered, summoning a ghost parrot that squawked sea shanties, startling her crew into laughter."],
        ["The Storm’s Core", "The logbook led Eryn to the storm’s core, a swirling vortex where the Stormheart pulsed with eerie light."],
        ["The Guardian Kraken", "A spectral kraken guarded the Stormheart, demanding Eryn prove her heart’s purity to claim it."],
        ["A Test of Trust", "Eryn shared a memory of saving a drowning sailor, her compassion swaying the kraken to yield the gem."],
        ["Silas’s Ambush", "Silas attacked in the vortex, his cannons firing shadow bolts, but the Wraith’s ghostly crew fought back with ethereal strength."],
        ["The Stormheart’s Power", "Eryn touched the Stormheart, its light revealing visions of the trapped crew, their souls crying for freedom."],
        ["Morna’s Secret", "Morna appeared, revealing she was once a sailor on the Wraith, cursed by a betrayed lover to trap souls."],
        ["A Twist Revealed", "Silas was Morna’s brother, seeking the Stormheart to free her, but his greed had corrupted his noble intent."],
        ["The Climax", "In the storm’s heart, Eryn faced Morna and Silas, using the Stormheart to sing a song of forgiveness, breaking the curse."],
        ["Freeing the Crew", "The Stormheart’s light freed the crew’s souls, their ghostly forms rising to the stars, thanking Eryn with silent nods."],
        ["Silas’s Redemption", "Silas, humbled, vowed to sail with Eryn, his heart cleansed by the Stormheart’s purifying glow."],
        ["Morna’s Peace", "Morna, now free, gifted Eryn a seashell that sang the ocean’s lullaby, guiding lost souls to her ship."],
        ["A New Soul", "A child’s soul signaled Eryn, lost in a distant fog, needing her to guide it home."],
        ["The Wraith’s Light", "The Wraith glowed brighter, its sails now shimmering with the freed souls’ gratitude."],
        ["Silas’s Role", "Silas became Eryn’s first mate, his knowledge of ghost ships aiding her in finding lost souls."],
        ["The Stormheart’s Song", "The Stormheart sang, its melody guiding Eryn to seas where souls needed her help."],
        ["The Child’s Rescue", "Eryn found the child’s soul, singing it to peace with the seashell’s lullaby, its light joining the stars."],
        ["A Funny Incident", "Eryn’s parrot summoned a ghost fish that flopped on deck, amusing the crew with its clumsy dance."],
        ["Morna’s Gift", "Morna taught Eryn a chant to calm stormy seas, enhancing the Stormheart’s power to guide souls."],
        ["The Wraith’s Legacy", "Eryn began training her crew to guide souls, ensuring the Wraith’s mission would continue."],
        ["A New Sea", "A distant sea signaled Eryn, its fog hiding a fleet of lost souls needing her touch."],
        ["The Kraken’s Trust", "The kraken named Eryn the Soul Captain, its tentacles saluting her courage."],
        ["Silas’s Peace", "Silas found peace, his ship now a beacon of hope, sailing beside the Wraith."],
        ["The Child’s Gratitude", "The child’s soul gifted Eryn a star-shaped pearl, its light echoing her kindness."],
        ["The Stormheart’s Vision", "The Stormheart showed Eryn visions of lost fleets, guiding her to her next mission."],
        ["The Wraith’s Song", "The Wraith sang, its melody soothing Eryn as she sailed through misty seas."],
        ["A Twist of Fate", "Eryn found a logbook page showing her as the Stormheart’s creator, destined to guide souls."],
        ["Morna’s Honor", "Morna named Eryn the Eternal Captain, her name whispered in the ocean’s waves."],
        ["The Kraken’s Gift", "The kraken gave Eryn a scale that glowed, enhancing her ability to find souls."],
        ["The Wraith’s Future", "The Wraith prepared for new journeys, its sails ready to guide more souls."],
        ["The Child’s Dream", "The child’s soul dreamed of sailing with Eryn, its light glowing with hope."],
        ["Silas’s Destiny", "Silas became a guardian captain, his ship protecting souls alongside Eryn."],
        ["The Sea’s Peace", "Eryn’s voyages brought peace to the seas, her Wraith a beacon of love."],
        ["A New Fleet", "A ghostly fleet signaled Eryn, its souls needing her to guide them home."],
        ["The Stormheart’s Oath", "Eryn swore to guide all souls, her heart tied to the Stormheart’s light."],
        ["The Sea’s Song", "The sea sang with Eryn, its waves a chorus of eternal peace."],
        ["The Child’s Growth", "The child’s soul joined Eryn’s crew, its light glowing with potential."],
        ["The Kraken’s Future", "The kraken glowed brighter, ready to guide Eryn to new seas."],
        ["A Funny Incident", "Eryn’s seashell summoned a ghost crab that danced, amusing her crew with its antics."],
        ["The Final Scene", "Eryn stood on the Wraith’s deck, Stormheart glowing, ready to guide the next soul home."],
      ]
     },

  {
    title: "The Starforge Blacksmith",
    desc: "A blacksmith forges weapons from fallen stars to save her kingdom.",
    color: "from-amber-400 to-red-600",
    totalPages: 50,
    pages: [
      ["The Celestial Forge", "In a mountain village, blacksmith Kael forged blades from fallen stars, her hammer singing with cosmic power."],
      ["The Fading Kingdom", "Kael’s kingdom dimmed, its light stolen by a sorcerer who wielded a starless blade of pure void."],
      ["The First Star", "A meteor crashed near Kael’s forge, its core glowing with a star’s heart, whispering of a weapon to restore light."],
      ["The Sorcerer’s Threat", "The sorcerer, Valthor, demanded Kael’s star, threatening to plunge the kingdom into eternal night."],
      ["A Defiant Stand", "Kael refused, her hammer sparking as she forged a dagger from the star, its blade cutting through shadows."],
      ["The Star Map", "The dagger revealed a map in its glow, pointing to a constellation where more stars awaited her hammer."],
      ["A Rival Smith", "Ragna, a rival blacksmith, ambushed Kael, seeking the star map to forge weapons for Valthor’s army."],
      ["A Narrow Escape", "Kael outwitted Ragna, using the dagger’s light to blind her, fleeing into a forest lit by star-dust."],
      ["The Constellation’s Call", "Kael climbed a peak where the constellation shone, its stars falling to her forge one by one."],
      ["A Funny Mishap", "Kael’s hammer misstruck, forging a spoon that sang lullabies, amusing her village’s children."],
      ["The Star Guardian", "A celestial wolf guarded the fallen stars, demanding Kael prove her heart’s purity to claim them."],
      ["A Test of Valor", "Kael shared a tale of saving her village from a fire, her courage earning the wolf’s trust."],
      ["The Second Star", "The wolf gifted Kael a star, its light forging a sword that hummed with the power of dawn."],
      ["Valthor’s Spy", "Valthor’s shadow spy stole Kael’s map, but the sword’s glow revealed the thief’s trail."],
      ["The Shadow Chase", "Kael pursued the spy through a canyon, her sword slicing through illusions cast by Valthor."],
      ["Ragna’s Betrayal", "Ragna reappeared, now Valthor’s ally, wielding a void-axe forged from stolen star fragments."],
      ["A Twist Revealed", "Ragna was Kael’s sister, estranged after a feud, now seeking power to prove her worth."],
      ["The Climax", "In the constellation’s heart, Kael faced Ragna, her sword’s light softening her sister’s heart."],
      ["Restoring Light", "Kael forged a shield from the final star, its radiance banishing Valthor’s void, saving the kingdom."],
      ["Ragna’s Redemption", "Ragna joined Kael, forging tools of peace, her heart healed by her sister’s forgiveness."],
      ["The Wolf’s Gift", "The celestial wolf gave Kael a star-ember, enhancing her forge’s ability to craft hope."],
      ["A New Threat", "A village signaled Kael, its crops dimming under a new shadow, needing her star-forged blades."],
      ["The Forge’s Light", "Kael’s forge glowed brighter, its flames now alive with the kingdom’s gratitude."],
      ["Ragna’s Role", "Ragna became Kael’s partner, her hammer crafting alongside Kael to protect the land."],
      ["The Star’s Song", "The star-ember sang, guiding Kael to new meteors for her forge."],
      ["The Village’s Hope", "Kael’s shield restored the village, its fields blooming under the star’s light."],
      ["A Funny Incident", "Kael forged a star-lantern that danced, accidentally lighting a festival with sparkles."],
      ["The Wolf’s Trust", "The wolf named Kael the Starforge, her hammer a legend among blacksmiths."],
      ["Ragna’s Peace", "Ragna found peace, her axe now forging bridges, thanks to Kael’s love."],
      ["The Village’s Gift", "The village gifted Kael a star-etched cloak, its threads glowing with thanks."],
      ["The Star’s Vision", "The star-ember showed Kael visions of shadowed lands needing her blades."],
      ["The Forge’s Song", "The forge sang a song of creation, its melody soothing Kael as she worked."],
      ["A Twist of Fate", "Kael found a star showing her as its smith, destined to forge the cosmos’s light."],
      ["The Village’s Future", "AThe village thrived, its people now smiths under her Kael’s guidance."],
      ["The Wolf’s Legacy", "AThe wolf gifted her Kael a star-claw, enhancing her hammer’s precision."],
      ["AThe New Meteor", "A new meteor crashed, its stars needing her Kael’s touch to shine."],
      [" AThe Star’s Oath", "Kael swore to forge light, her heart tied to the star-ember’s glow."],
      [" The Constellation’s Song", "AThe constellation sang a song."],
      ["Ragna’s Gift", "ARagna crafted a star-ring for Kael, its light pulsing with hope."],
      ["The Village’s Heart", "AThe village’s gratitude grew."],
      ["The Star’s Peace", "AThe star-ember forged peace."],
      ["A New Land", "AA distant land signaled Kael."],
      ["The Forge’s Future", "AThe forge glowed."],
      ["AThe Child’s Dream", "A child dreamed of forging with Kael."],
      ["AThe Wolf’s Future", "AThe wolf glowed brighter."],
      ["A Funny Mishap", "Kael’s lantern sparked a star that turned a rock into a glowing turtle, waddling through the village."],
      ["The Star’s Legacy", "AThe star-ember guided her Kael."],
      ["AThe Constellation", "AThe constellation shone."],
      ["Ragna’s Future", "ARagna vowed to forge with Kael."],
      ["The Final Scene", "AKael stood at her forge, star-ember glowing, ready to craft the next blade of light."]
    ]
  },
  {
    title: "The Whispering Cartographer",
    desc: "A mapmaker hears the land’s secrets to save it from collapse.",
    color: "from-green-400 to-emerald-600",
    totalPages: 50,
    pages: [
      ["The Mapmaker’s Hut", "In a verdant valley, cartographer Lyra drew maps that whispered the land’s secrets, guiding travelers to safety."],
      ["The Crumbling Earth", "The land began to crack, its rivers drying, as a hidden force drained its life."],
      ["The First Whisper", "Lyra’s quill trembled, drawing a map that spoke of a Heartstone buried deep, holding the land’s essence."],
      ["The Shadow Druid", "A druid, Malor, sought the Heartstone to twist the land into a dark forest under his rule."],
      ["A Bold Venture", "Lyra followed the map’s whispers, her quill glowing as it traced paths through crumbling cliffs."],
      ["The Whispering Grove", "The map led to a grove where trees sang, their roots guarding the first clue to the Heartstone."],
      ["A Rival Mapper", "Talia, a rival cartographer, stole Lyra’s quill, aiming to claim the Heartstone for Malor."],
      ["A Clever Trick", "Lyra used a decoy map to mislead Talia, her quill’s whispers guiding her to safety."],
      ["A Funny Mishap", "Lyra’s quill drew a dancing tree, its branches tickling travelers, causing a forest giggle-fest."],
      ["The Grove’s Guardian", "A tree spirit demanded Lyra prove her love for the land to reveal the Heartstone’s path."],
      ["A Test of Care", "Lyra planted a seed from her village, her care sprouting a new tree, earning the spirit’s trust."],
      ["The Second Clue", "The spirit gifted Lyra a leaf-map, its veins pointing to a cave where the Heartstone pulsed."],
      ["Malor’s Trap", "Malor’s vines ensnared Lyra in the cave, but her quill drew a path to escape."],
      ["The Cave’s Song", "The cave sang of the Heartstone’s power, its melody guiding Lyra to its hidden chamber."],
      ["Talia’s Betrayal", "Talia reappeared, now Malor’s apprentice, wielding a thorn-quill that twisted Lyra’s maps."],
      ["A Twist Revealed", "Talia was Lyra’s cousin, jealous of her talent, now seeking to outshine her."],
      ["The Climax", "In the Heartstone’s chamber, Lyra faced Talia, her quill drawing a map of their shared past, softening her heart."],
      ["Restoring the Land", "Lyra touched the Heartstone, its light healing the land, rivers flowing once more."],
      ["Talia’s Redemption", "Talia joined Lyra, her quill now drawing maps of peace, her heart healed."],
      ["The Spirit’s Gift", "The tree spirit gave Lyra a seed-quill, enhancing her maps’ ability to heal."],
      ["A New Village", "A village signaled Lyra, its fields dying, needing her whispering maps."],
      ["The Hut’s Light", "Lyra’s hut glowed, its walls alive with the land’s gratitude."],
      ["Talia’s Role", "Talia became Lyra’s partner, her maps aiding the land’s recovery."],
      ["The Heartstone’s Song", "The Heartstone sang, guiding Lyra to new lands needing her touch."],
      ["The Village’s Hope", "Lyra’s map restored the village, its crops blooming vibrantly."],
      ["A Funny Incident", "Lyra’s quill drew a singing river, its bubbles amusing children."],
      ["The Spirit’s Trust", "The tree spirit named Lyra the Whisperer, her quill a legend."],
      ["Talia’s Peace", "Talia found peace, her maps now weaving hope."],
      ["The Village’s Gift", "The village gifted Lyra a leaf-cloak, its glow echoing thanks."],
      ["The Heartstone’s Vision", "The Heartstone showed visions of dying lands needing Lyra."],
      ["The Hut’s Song", "The hut sang, soothing Lyra as she drew new maps."],
      ["A Twist of Fate", "Lyra found a map showing her as the Heartstone’s keeper, destined to save lands."],
      ["The Village’s Future", "The village thrived, its people now mappers under Lyra’s guidance."],
      ["The Spirit’s Legacy", "The spirit gifted Lyra a root-quill, enhancing her maps’ precision."],
      ["A New Land", "A new land signaled Lyra, its forests fading."],
      ["The Heartstone’s Oath", "Lyra swore to heal all lands, her heart tied to the Heartstone."],
      ["The Grove’s Song", "The grove sang, a tribute to Lyra’s courage."],
      ["Talia’s Gift", "Talia crafted a vine-map for Lyra, its lines glowing with hope."],
      ["The Village’s Heart", "The village’s gratitude grew, its fields vibrant."],
      ["The Heartstone’s Peace", "The Heartstone restored peace, its light eternal."],
      ["A New Path", "A distant path signaled Lyra, its secrets needing her quill."],
      ["The Hut’s Future", "The hut glowed, ready for new maps."],
      ["A Child’s Dream", "A child dreamed of mapping with Lyra, her quill glowing."],
      ["The Spirit’s Future", "The spirit shone brighter, guiding Lyra."],
      ["A Funny Incident", "Lyra’s quill drew a hopping frog, amusing the village."],
      ["The Heartstone’s Legacy", "The Heartstone guided Lyra, its light eternal."],
      ["The Grove’s Future", "The grove glowed, ready for Lyra’s maps."],
      ["Talia’s Future", "Talia vowed to map with Lyra, their bond eternal."],
      ["The Final Scene", "Lyra stood in her hut, quill glowing, ready to draw the next map of life."]
    ]
  },
  {
    title: "The Clockwork Oracle",
    desc: "An inventor seeks a mechanical oracle to prevent a disaster.",
    color: "from-bronze-400 to-gold-600",
    totalPages: 50,
    pages: [
      ["The Tinker’s Workshop", "In a steam-powered city, inventor Nora crafted gears that hummed with foresight, her tools alive with ideas."],
      ["The Looming Catastrophe", "A vision warned Nora of a city collapse, caused by a flaw in its core engine."],
      ["The Oracle’s Blueprint", "Nora found a blueprint for a Clockwork Oracle, a machine that could predict disasters, hidden in a vault."],
      ["The Iron Consul", "Consul Vex, the city’s ruler, sought the Oracle to control fate, his spies watching Nora’s workshop."],
      ["A Secret Mission", "Nora sneaked into the vault, her gears clicking softly, unlocking the blueprint with a tiny automaton."],
      ["The First Gear", "The blueprint revealed a star-gear, its teeth etched with predictions, hidden in a clocktower."],
      ["A Rival Tinker", "Galen, a rival inventor, stole Nora’s tools, aiming to build the Oracle for Vex."],
      ["A Clever Disguise", "Nora posed as a gear merchant, retrieving her tools with a ticking distraction."],
      ["A Funny Mishap", "Nora’s automaton danced a jig, startling a market crowd, its gears clanking comically."],
      ["The Clocktower’s Guardian", "A brass eagle guarded the star-gear, demanding Nora prove her intent to save, not control."],
      ["A Test of Truth", "Nora shared her vision of the collapse, her honesty earning the eagle’s trust."],
      ["The Second Gear", "The eagle gifted Nora the star-gear, its spin revealing the Oracle’s next piece."],
      ["Vex’s Trap", "Vex’s drones cornered Nora, but her automaton jammed their circuits, letting her escape."],
      ["The Gear’s Vision", "The star-gear showed the core engine’s flaw, a crack spreading through the city."],
      ["Galen’s Betrayal", "Galen, now Vex’s ally, built a false Oracle, its predictions serving the Consul’s greed."],
      ["A Twist Revealed", "Galen was Nora’s mentor, exiled for ambition, now seeking to outshine her."],
      ["The Climax", "In the engine’s core, Nora faced Galen, her Oracle’s truth exposing his lies, saving the city."],
      ["Restoring Balance", "Nora fixed the engine, the Oracle’s gears humming, preventing the collapse."],
      ["Galen’s Redemption", "Galen joined Nora, his tools now aiding the city’s repair, his heart healed."],
      ["The Eagle’s Gift", "The eagle gave Nora a crystal-gear, enhancing the Oracle’s foresight."],
      ["A New Warning", "A district signaled Nora, its pipes failing, needing her Oracle’s predictions."],
      ["The Workshop’s Light", "Nora’s workshop glowed, its gears alive with the city’s thanks."],
      ["Galen’s Role", "Galen became Nora’s partner, his inventions aiding her mission."],
      ["The Oracle’s Song", "The Oracle sang, guiding Nora to new threats."],
      ["The District’s Hope", "Nora’s Oracle saved the district, its pipes flowing again."],
      ["A Funny Incident", "Nora’s gear turned a drone into a singing bot, amusing workers."],
      ["The Eagle’s Trust", "The eagle named Nora the Oracle Keeper, her tools legendary."],
      ["Galen’s Peace", "Galen found peace, his gears now weaving hope."],
      ["The District’s Gift", "The district gifted Nora a brass locket, its ticks echoing thanks."],
      ["The Oracle’s Vision", "The Oracle showed visions of new flaws needing Nora."],
      ["The Workshop’s Song", "The workshop sang, soothing Nora as she built."],
      ["A Twist of Fate", "Nora found a gear showing her as the Oracle’s creator, destined to save."],
      ["The District’s Future", "The district thrived, its people now tinkers under Nora."],
      ["The Eagle’s Legacy", "The eagle gifted Nora a feather-gear, enhancing precision."],
      ["A New Flaw", "A new flaw signaled Nora, its gears grinding."],
      ["The Oracle’s Oath", "Nora swore to save all cities, her heart tied to the Oracle."],
      ["The Clocktower’s Song", "The clocktower sang, a tribute to Nora’s courage."],
      ["Galen’s Gift", "Galen crafted a star-tool for Nora, its light glowing."],
      ["The District’s Heart", "The district’s gratitude grew, its pipes strong."],
      ["The Oracle’s Peace", "The Oracle restored peace, its gears eternal."],
      ["A New City", "A distant city signaled Nora, its engines failing."],
      ["The Workshop’s Future", "The workshop glowed, ready for new gears."],
      ["A Child’s Dream", "A child dreamed of inventing with Nora, her tools glowing."],
      ["The Eagle’s Future", "The eagle shone brighter, guiding Nora."],
      ["A Funny Incident", "Nora’s gear turned a pipe into a flute, amusing the city."],
      ["The Oracle’s Legacy", "The Oracle guided Nora, its light eternal."],
      ["The Clocktower’s Future", "The clocktower glowed, ready for Nora’s gears."],
      ["Galen’s Future", "Galen vowed to build with Nora, their bond eternal."],
      ["The Final Scene", "Nora stood in her workshop, Oracle glowing, ready to predict the next disaster."]
    ]
  },
  {
    title: "The Moonshadow Dancer",
    desc: "A dancer uses moonlit steps to free a cursed city.",
    color: "from-silver-400 to-indigo-600",
    totalPages: 50,
    pages: [
      ["The Moonlit Stage", "In a cursed city, dancer Selene performed under moonlight, her steps weaving magic to lift shadows."],
      ["The Eternal Night", "The city was trapped in darkness, its people joyless, cursed by a forgotten moon spirit."],
      ["The First Dance", "Selene’s dance sparked a moonbeam, revealing a path to the Moonheart, a gem that could break the curse."],
      ["The Shadow Lord", "Lord Umber, the curse’s keeper, sought to stop Selene, his shadows stalking her every step."],
      ["A Graceful Defiance", "Selene danced through Umber’s shadows, her steps scattering them, her heart fearless."],
      ["The Moon’s Whisper", "The moon whispered a choreography, its steps leading Selene to a temple where the Moonheart hid."],
      ["A Rival Dancer", "Vera, a rival dancer, stole Selene’s moon-sash, aiming to claim the Moonheart for Umber."],
      ["A Clever Spin", "Selene spun a decoy sash, misleading Vera, her steps guiding her to the temple."],
      ["A Funny Mishap", "Selene’s dance summoned a moon-rabbit, hopping comically, startling temple guards."],
      ["The Temple’s Guardian", "A lunar fox guarded the Moonheart, demanding Selene dance a story of hope."],
      ["A Test of Joy", "Selene danced her village’s festival, her joy earning the fox’s trust."],
      ["The Second Step", "The fox gifted Selene a moon-step, its rhythm revealing the Moonheart’s chamber."],
      ["Umber’s Trap", "Umber’s shadows ensnared Selene, but her moon-step dissolved them."],
      ["The Chamber’s Light", "The chamber glowed with moonbeams, guiding Selene to the Moonheart."],
      ["Vera’s Betrayal", "Vera, now Umber’s ally, danced a shadow-waltz, twisting Selene’s steps."],
      ["A Twist Revealed", "Vera was Selene’s sister, lost to Umber’s lies, seeking to outdance her."],
      ["The Climax", "In the Moonheart’s chamber, Selene faced Vera, her dance weaving their past, softening her heart."],
      ["Lifting the Curse", "Selene touched the Moonheart, its light banishing the curse, daylight returning."],
      ["Vera’s Redemption", "Vera joined Selene, her dances now spreading joy, her heart healed."],
      ["The Fox’s Gift", "The lunar fox gave Selene a moon-veil, enhancing her dance’s magic."],
      ["A New City", "A city signaled Selene, its streets dim, needing her moonlit steps."],
      ["The Stage’s Light", "Selene’s stage glowed, its boards alive with the city’s thanks."],
      ["Vera’s Role", "Vera became Selene’s partner, her dances aiding the city’s light."],
      ["The Moonheart’s Song", "The Moonheart sang, guiding Selene to new shadows."],
      ["The City’s Hope", "Selene’s dance restored the city, its streets vibrant."],
      ["A Funny Incident", "Selene’s veil summoned a dancing star, amusing crowds."],
      ["The Fox’s Trust", "The fox named Selene the Moonshadow, her steps legendary."],
      ["Vera’s Peace", "Vera found peace, her dances weaving hope."],
      ["The City’s Gift", "The city gifted Selene a moon-locket, its glow echoing thanks."],
      ["The Moonheart’s Vision", "The Moonheart showed visions of dark cities needing Selene."],
      ["The Stage’s Song", "The stage sang, soothing Selene as she danced."],
      ["A Twist of Fate", "Selene found a step showing her as the Moonheart’s creator, destined to dance."],
      ["The City’s Future", "The city thrived, its people now dancers under Selene."],
      ["The Fox’s Legacy", "The fox gifted Selene a star-step, enhancing precision."],
      ["A New Shadow", "A new shadow signaled Selene, its darkness spreading."],
      ["The Moonheart’s Oath", "Selene swore to dance all shadows away, her heart tied to the Moonheart."],
      ["The Temple’s Song", "The temple sang, a tribute to Selene’s grace."],
      ["Vera’s Gift", "Vera crafted a moon-sash for Selene, its light glowing."],
      ["The City’s Heart", "The city’s gratitude grew, its streets bright."],
      ["The Moonheart’s Peace", "The Moonheart restored peace, its light eternal."],
      ["A New Dance", "A distant dance signaled Selene, its steps needing her touch."],
      ["The Stage’s Future", "The stage glowed, ready for new dances."],
      ["A Child’s Dream", "A child dreamed of dancing with Selene, her steps glowing."],
      ["The Fox’s Future", "The fox shone brighter, guiding Selene."],
      ["A Funny Incident", "Selene’s sash summoned a hopping moon-frog, amusing the city."],
      ["The Moonheart’s Legacy", "The Moonheart guided Selene, its light eternal."],
      ["The Temple’s Future", "The temple glowed, ready for Selene’s dances."],
      ["Vera’s Future", "Vera vowed to dance with Selene, their bond eternal."],
      ["The Final Scene", "Selene stood on her stage, Moonheart glowing, ready to dance the next shadow away."]
    ]
  },
  {
    title: "The Frostweaver’s Tapestry",
    desc: "A weaver crafts ice tapestries to thaw a frozen realm.",
    color: "from-cyan-400 to-blue-600",
    totalPages: 50,
    pages: [
      ["The Icy Loom", "In a frozen realm, weaver Eira crafted tapestries of ice, their threads warming hearts."],
      ["The Eternal Winter", "The realm was locked in ice, its people shivering, cursed by a frost giant."],
      ["The First Thread", "Eira’s loom wove a thread that glowed, revealing a path to the Sunshard, a gem to thaw the curse."],
      ["The Giant’s Wrath", "Giant Thrym sought the Sunshard to keep the realm frozen, his ice wolves hunting Eira."],
      ["A Warm Defiance", "Eira wove a scarf that melted Thrym’s ice, her heart burning with hope."],
      ["The Loom’s Song", "The loom sang of a glacier where the Sunshard hid, its threads guiding Eira."],
      ["A Rival Weaver", "Sigrid, a rival, stole Eira’s ice-needle, aiming to claim the Sunshard for Thrym."],
      ["A Clever Knot", "Eira tied a decoy thread, misleading Sigrid, her loom’s song leading her to safety."],
      ["A Funny Mishap", "Eira’s thread wove a snowman that danced, amusing villagers with its waddle."],
      ["The Glacier’s Guardian", "An ice phoenix guarded the Sunshard, demanding Eira weave a tale of warmth."],
      ["A Test of Heart", "Eira wove her village’s hearth fires, her love earning the phoenix’s trust."],
      ["The Second Thread", "The phoenix gifted Eira a flame-thread, its glow revealing the Sunshard’s cave."],
      ["Thrym’s Trap", "Thrym’s blizzard trapped Eira, but her flame-thread melted a path."],
      ["The Cave’s Glow", "The cave shone with warmth, guiding Eira to the Sunshard."],
      ["Sigrid’s Betrayal", "Sigrid, now Thrym’s ally, wove an ice-net, twisting Eira’s tapestries."],
      ["A Twist Revealed", "Sigrid was Eira’s aunt, envious of her talent, seeking to outshine her."],
      ["The Climax", "In the Sunshard’s cave, Eira faced Sigrid, her tapestry weaving their past, softening her heart."],
      ["Thawing the Realm", "Eira touched the Sunshard, its warmth melting the ice, spring returning."],
      ["Sigrid’s Redemption", "Sigrid joined Eira, her tapestries now warming hearts, her heart healed."],
      ["The Phoenix’s Gift", "The ice phoenix gave Eira a spark-thread, enhancing her loom’s magic."],
      ["A New Village", "A village signaled Eira, its rivers frozen, needing her ice tapestries."],
      ["The Loom’s Light", "Eira’s loom glowed, its threads alive with the realm’s thanks."],
      ["Sigrid’s Role", "Sigrid became Eira’s partner, her tapestries aiding the thaw."],
      ["The Sunshard’s Song", "The Sunshard sang, guiding Eira to new frosts."],
      ["The Village’s Hope", "Eira’s tapestry thawed the village, its rivers flowing."],
      ["A Funny Incident", "Eira’s thread wove a skating penguin, amusing children."],
      ["The Phoenix’s Trust", "The phoenix named Eira the Frostweaver, her loom legendary."],
      ["Sigrid’s Peace", "Sigrid found peace, her tapestries weaving hope."],
      ["The Village’s Gift", "The village gifted Eira a frost-locket, its glow echoing thanks."],
      ["The Sunshard’s Vision", "The Sunshard showed visions of frozen lands needing Eira."],
      ["The Loom’s Song", "The loom sang, soothing Eira as she wove."],
      ["A Twist of Fate", "Eira found a thread showing her as the Sunshard’s keeper, destined to thaw."],
      ["The Village’s Future", "The village thrived, its people now weavers under Eira."],
      ["The Phoenix’s Legacy", "The phoenix gifted Eira a flame-needle, enhancing precision."],
      ["A New Frost", "A new frost signaled Eira, its ice spreading."],
      ["The Sunshard’s Oath", "Eira swore to thaw all realms, her heart tied to the Sunshard."],
      ["The Glacier’s Song", "The glacier sang, a tribute to Eira’s warmth."],
      ["Sigrid’s Gift", "Sigrid crafted a snow-thread for Eira, its light glowing."],
      ["The Village’s Heart", "The village’s gratitude grew, its rivers vibrant."],
      ["The Sunshard’s Peace", "The Sunshard restored peace, its warmth eternal."],
      ["A New Thaw", "A distant thaw signaled Eira, its ice needing her touch."],
      ["The Loom’s Future", "The loom glowed, ready for new tapestries."],
      ["A Child’s Dream", "A child dreamed of weaving with Eira, her threads glowing."],
      ["The Phoenix’s Future", "The phoenix shone brighter, guiding Eira."],
      ["A Funny Incident", "Eira’s thread wove a hopping snowball, amusing the village."],
      ["The Sunshard’s Legacy", "The Sunshard guided Eira, its warmth eternal."],
      ["The Glacier’s Future", "The glacier glowed, ready for Eira’s tapestries."],
      ["Sigrid’s Future", "Sigrid vowed to weave with Eira, their bond eternal."],
      ["The Final Scene", "Eira stood at her loom, Sunshard glowing, ready to weave the next tapestry of warmth."]
    ]
  },
  {
    title: "The Dreamcatcher’s Net",
    desc: "A weaver captures nightmares to save dreamers’ minds.",
    color: "from-purple-400 to-pink-600",
    totalPages: 50,
    pages: [
      ["The Dreamweaver’s Den", "In a twilight realm, weaver Aria spun nets to catch nightmares, freeing dreamers’ minds."],
      ["The Haunted Dreams", "Dreamers suffered, their minds trapped in endless nightmares spun by a shadow wraith."],
      ["The First Net", "Aria’s net glowed, capturing a nightmare that revealed a Dreamcore, a gem to banish wraiths."],
      ["The Wraith’s Curse", "Wraith Nyx sought the Dreamcore to trap all minds, her shadows haunting Aria’s den."],
      ["A Brave Catch", "Aria wove a net that snared Nyx’s shadow, her heart steady despite the wraith’s screams."],
      ["The Net’s Vision", "The net showed a path to a dreamscape where the Dreamcore pulsed, guiding Aria."],
      ["A Rival Weaver", "Lira, a rival, stole Aria’s dream-threads, aiming to claim the Dreamcore for Nyx."],
      ["A Clever Snare", "Aria wove a decoy net, misleading Lira, her threads leading her to safety."],
      ["A Funny Mishap", "Aria’s net caught a dream-pig that oinked lullabies, amusing dreamers."],
      ["The Dreamscape’s Guardian", "A star-owl guarded the Dreamcore, demanding Aria weave a dream of peace."],
      ["A Test of Calm", "Aria wove her village’s quiet nights, her calm earning the owl’s trust."],
      ["The Second Thread", "The owl gifted Aria a star-thread, its glow revealing the Dreamcore’s lair."],
      ["Nyx’s Trap", "Nyx’s nightmares ensnared Aria, but her star-thread wove a path to escape."],
      ["The Lair’s Light", "The lair shone with dreams, guiding Aria to the Dreamcore."],
      ["Lira’s Betrayal", "Lira, now Nyx’s ally, wove a nightmare-net, twisting Aria’s dreams."],
      ["A Twist Revealed", "Lira was Aria’s friend, corrupted by Nyx, seeking to outweave her."],
      ["The Climax", "In the Dreamcore’s lair, Aria faced Lira, her net weaving their past, softening her heart."],
      ["Freeing Minds", "Aria touched the Dreamcore, its light banishing nightmares, freeing dreamers."],
      ["Lira’s Redemption", "Lira joined Aria, her nets now catching peace, her heart healed."],
      ["The Owl’s Gift", "The star-owl gave Aria a moon-thread, enhancing her net’s magic."],
      ["A New Dreamer", "A dreamer signaled Aria, their mind trapped, needing her nets."],
      ["The Den’s Light", "Aria’s den glowed, its walls alive with dreamers’ thanks."],
      ["Lira’s Role", "Lira became Aria’s partner, her nets aiding dreamers’ peace."],
      ["The Dreamcore’s Song", "The Dreamcore sang, guiding Aria to new nightmares."],
      ["The Dreamer’s Hope", "Aria’s net freed the dreamer, their mind calm again."],
      ["A Funny Incident", "Aria’s thread wove a dancing dream-cat, amusing dreamers."],
      ["The Owl’s Trust", "The owl named Aria the Dreamcatcher, her nets legendary."],
      ["Lira’s Peace", "Lira found peace, her nets weaving hope."],
      ["The Dreamer’s Gift", "The dreamer gifted Aria a star-locket, its glow echoing thanks."],
      ["The Dreamcore’s Vision", "The Dreamcore showed visions of trapped minds needing Aria."],
      ["The Den’s Song", "The den sang, soothing Aria as she wove."],
      ["A Twist of Fate", "Aria found a thread showing her as the Dreamcore’s keeper, destined to free."],
      ["The Dreamer’s Future", "The dreamer thrived, their mind now a weaver under Aria."],
      ["The Owl’s Legacy", "The owl gifted Aria a star-needle, enhancing precision."],
      ["A New Nightmare", "A new nightmare signaled Aria, its shadows spreading."],
      ["The Dreamcore’s Oath", "Aria swore to free all minds, her heart tied to the Dreamcore."],
      ["The Dreamscape’s Song", "The dreamscape sang, a tribute to Aria’s courage."],
      ["Lira’s Gift", "Lira crafted a dream-thread for Aria, its light glowing."],
      ["The Dreamer’s Heart", "The dreamer’s gratitude grew, their mind vibrant."],
      ["The Dreamcore’s Peace", "The Dreamcore restored peace, its light eternal."],
      ["A New Mind", "A distant mind signaled Aria, its dreams needing her touch."],
      ["The Den’s Future", "The den glowed, ready for new nets."],
      ["A Child’s Dream", "A child dreamed of weaving with Aria, her threads glowing."],
      ["The Owl’s Future", "The owl shone brighter, guiding Aria."],
      ["A Funny Incident", "Aria’s net caught a hopping dream-frog, amusing dreamers."],
      ["The Dreamcore’s Legacy", "The Dreamcore guided Aria, its light eternal."],
      ["The Dreamscape’s Future", "The dreamscape glowed, ready for Aria’s nets."],
      ["Lira’s Future", "Lira vowed to weave with Aria, their bond eternal."],
      ["The Final Scene", "Aria stood in her den, Dreamcore glowing, ready to catch the next nightmare."]
    ]
  },
  {
    title: "The Skyforge Alchemist",
    desc: "An alchemist brews potions from clouds to save a floating city.",
    color: "from-teal-400 to-cyan-600",
    totalPages: 50,
    pages: [
      ["The Cloud Cauldron", "In a floating city, alchemist Zephyr brewed potions from clouds, their mists healing hearts."],
      ["The Sinking City", "The city began to fall, its anchors fading, drained by a storm wraith."],
      ["The First Mist", "Zephyr’s cauldron bubbled, brewing a potion that revealed a Skycore, a gem to lift the city."],
      ["The Wraith’s Hunger", "Wraith Tempest sought the Skycore to sink all cities, her storms chasing Zephyr."],
      ["A Bold Brew", "Zephyr brewed a mist that scattered Tempest’s storm, her heart calm under pressure."],
      ["The Cauldron’s Vision", "The cauldron showed a cloud-mountain where the Skycore hid, guiding Zephyr."],
      ["A Rival Alchemist", "Kara, a rival, stole Zephyr’s mist-vial, aiming to claim the Skycore for Tempest."],
      ["A Clever Concoction", "Zephyr brewed a decoy potion, misleading Kara, her cauldron’s vision leading her to safety."],
      ["A Funny Mishap", "Zephyr’s potion turned a cloud into a giggling puff, amusing city dwellers."],
      ["The Mountain’s Guardian", "A sky-dragon guarded the Skycore, demanding Zephyr brew a potion of trust."],
      ["A Test of Faith", "Zephyr brewed her city’s hope, her faith earning the dragon’s trust."],
      ["The Second Mist", "The dragon gifted Zephyr a star-mist, its glow revealing the Skycore’s peak."],
      ["Tempest’s Trap", "Tempest’s winds trapped Zephyr, but her star-mist cleared a path."],
      ["The Peak’s Light", "The peak shone with clouds, guiding Zephyr to the Skycore."],
      ["Kara’s Betrayal", "Kara, now Tempest’s ally, brewed a storm-potion, twisting Zephyr’s mists."],
      ["A Twist Revealed", "Kara was Zephyr’s sister, envious of her skill, seeking to outshine her."],
      ["The Climax", "In the Skycore’s peak, Zephyr faced Kara, her potion weaving their past, softening her heart."],
      ["Lifting the City", "Zephyr touched the Skycore, its light raising the city, anchors strong again."],
      ["Kara’s Redemption", "Kara joined Zephyr, her potions now lifting hearts, her heart healed."],
      ["The Dragon’s Gift", "The sky-dragon gave Zephyr a cloud-vial, enhancing her cauldron’s magic."],
      ["A New City", "A city signaled Zephyr, its skies fading, needing her cloud potions."],
      ["The Cauldron’s Light", "Zephyr’s cauldron glowed, its mists alive with the city’s thanks."],
      ["Kara’s Role", "Kara became Zephyr’s partner, her potions aiding the city’s rise."],
      ["The Skycore’s Song", "The Skycore sang, guiding Zephyr to new storms."],
      ["The City’s Hope", "Zephyr’s potion lifted the city, its skies vibrant."],
      ["A Funny Incident", "Zephyr’s mist turned a cloud into a dancing wisp, amusing children."],
      ["The Dragon’s Trust", "The dragon named Zephyr the Skyforge, her cauldron legendary."],
      ["Kara’s Peace", "Kara found peace, her potions weaving hope."],
      ["The City’s Gift", "The city gifted Zephyr a mist-locket, its glow echoing thanks."],
      ["The Skycore’s Vision", "The Skycore showed visions of falling cities needing Zephyr."],
      ["The Cauldron’s Song", "The cauldron sang, soothing Zephyr as she brewed."],
      ["A Twist of Fate", "Zephyr found a mist showing her as the Skycore’s keeper, destined to lift."],
      ["The City’s Future", "The city thrived, its people now alchemists under Zephyr."],
      ["The Dragon’s Legacy", "The dragon gifted Zephyr a star-vial, enhancing precision."],
      ["A New Storm", "A new storm signaled Zephyr, its winds spreading."],
      ["The Skycore’s Oath", "Zephyr swore to lift all cities, her heart tied to the Skycore."],
      ["The Mountain’s Song", "The mountain sang, a tribute to Zephyr’s courage."],
      ["Kara’s Gift", "Kara crafted a cloud-potion for Zephyr, its light glowing."],
      ["The City’s Heart", "The city’s gratitude grew, its skies vibrant."],
      ["The Skycore’s Peace", "The Skycore restored peace, its light eternal."],
      ["A New Sky", "A distant sky signaled Zephyr, its clouds needing her touch."],
      ["The Cauldron’s Future", "The cauldron glowed, ready for new potions."],
      ["A Child’s Dream", "A child dreamed of brewing with Zephyr, her vials glowing."],
      ["The Dragon’s Future", "The dragon shone brighter, guiding Zephyr."],
      ["A Funny Incident", "Zephyr’s potion turned a cloud into a hopping puff, amusing the city."],
      ["The Skycore’s Legacy", "The Skycore guided Zephyr, its light eternal."],
      ["The Mountain’s Future", "The mountain glowed, ready for Zephyr’s potions."],
      ["Kara’s Future", "Kara vowed to brew with Zephyr, their bond eternal."],
      ["The Final Scene", "Zephyr stood at her cauldron, Skycore glowing, ready to brew the next potion of lift."]
    ]
  },
  {
    title: "The Starlit Scribe",
    desc: "A writer pens tales that shape reality to save her world.",
    color: "from-indigo-400 to-purple-600",
    totalPages: 50,
    pages: [
      ["The Quill’s Haven", "In a fading world, scribe Elowen wrote tales that shaped reality, her quill glowing with starlight."],
      ["The Vanishing Lands", "The world began to fade, its colors draining, as a void wraith unraveled its stories."],
      ["The First Tale", "Elowen’s quill penned a tale that sparked a star, revealing a Wordcore, a gem to restore reality."],
      ["The Wraith’s Hunger", "Wraith Obliv sought the Wordcore to erase all tales, her voids chasing Elowen’s words."],
      ["A Bold Story", "Elowen wrote a tale that banished Obliv’s void, her heart steady under the wraith’s gaze."],
      ["The Quill’s Vision", "The quill showed a starfield where the Wordcore hid, guiding Elowen’s pen."],
      ["A Rival Scribe", "Toren, a rival, stole Elowen’s ink, aiming to claim the Wordcore for Obliv."],
      ["A Clever Plot", "Elowen penned a decoy tale, misleading Toren, her quill’s vision leading her to safety."],
      ["A Funny Mishap", "Elowen’s tale summoned a star-pig that snorted rhymes, amusing villagers."],
      ["The Starfield’s Guardian", "A cosmic raven guarded the Wordcore, demanding Elowen write a tale of truth."],
      ["A Test of Honesty", "Elowen wrote her world’s hope, her truth earning the raven’s trust."],
      ["The Second Tale", "The raven gifted Elowen a star-ink, its glow revealing the Wordcore’s lair."],
      ["Obliv’s Trap", "Obliv’s voids trapped Elowen, but her star-ink wrote a path to escape."],
      ["The Lair’s Light", "The lair shone with stars, guiding Elowen to the Wordcore."],
      ["Toren’s Betrayal", "Toren, now Obliv’s ally, wrote a void-tale, twisting Elowen’s stories."],
      ["A Twist Revealed", "Toren was Elowen’s brother, lost to Obliv’s lies, seeking to outwrite her."],
      ["The Climax", "In the Wordcore’s lair, Elowen faced Toren, her tale weaving their past, softening his heart."],
      ["Restoring Reality", "Elowen touched the Wordcore, its light rewriting reality, colors returning."],
      ["Toren’s Redemption", "Toren joined Elowen, his tales now shaping hope, his heart healed."],
      ["The Raven’s Gift", "The cosmic raven gave Elowen a star-quill, enhancing her tales’ magic."],
      ["A New World", "A world signaled Elowen, its stories fading, needing her tales."],
      ["The Haven’s Light", "Elowen’s haven glowed, its pages alive with the world’s thanks."],
      ["Toren’s Role", "Toren became Elowen’s partner, his tales aiding reality’s repair."],
      ["The Wordcore’s Song", "The Wordcore sang, guiding Elowen to new voids."],
      ["The World’s Hope", "Elowen’s tale restored the world, its colors vibrant."],
      ["A Funny Incident", "Elowen’s quill wrote a dancing star-bird, amusing children."],
      ["The Raven’s Trust", "The raven named Elowen the Starlit, her quill legendary."],
      ["Toren’s Peace", "Toren found peace, his tales weaving hope."],
      ["The World’s Gift", "The world gifted Elowen a star-locket, its glow echoing thanks."],
      ["The Wordcore’s Vision", "The Wordcore showed visions of fading worlds needing Elowen."],
      ["The Haven’s Song", "The haven sang, soothing Elowen as she wrote."],
      ["A Twist of Fate", "Elowen found a tale showing her as the Wordcore’s keeper, destined to write."],
      ["The World’s Future", "The world thrived, its people now scribes under Elowen."],
      ["The Raven’s Legacy", "The raven gifted Elowen a star-ink, enhancing precision."],
      ["A New Void", "A new void signaled Elowen, its darkness spreading."],
      ["The Wordcore’s Oath", "Elowen swore to write all realities, her heart tied to the Wordcore."],
      ["The Starfield’s Song", "The starfield sang, a tribute to Elowen’s courage."],
      ["Toren’s Gift", "Toren crafted a star-page for Elowen, its light glowing."],
      ["The World’s Heart", "The world’s gratitude grew, its colors vibrant."],
      ["The Wordcore’s Peace", "The Wordcore restored peace, its light eternal."],
      ["A New Story", "A distant story signaled Elowen, its words needing her touch."],
      ["The Haven’s Future", "The haven glowed, ready for new tales."],
      ["A Child’s Dream", "A child dreamed of writing with Elowen, her quill glowing."],
      ["The Raven’s Future", "The raven shone brighter, guiding Elowen."],
      ["A Funny Incident", "Elowen’s tale summoned a hopping star-frog, amusing the world."],
      ["The Wordcore’s Legacy", "The Wordcore guided Elowen, its light eternal."],
      ["The Starfield’s Future", "The starfield glowed, ready for Elowen’s tales."],
      ["Toren’s Future", "Toren vowed to write with Elowen, their bond eternal."],
      ["The Final Scene", "Elowen stood in her haven, Wordcore glowing, ready to pen the next tale of reality."]
    ]
  },
  {
    title: "The Tidecaller’s Conch",
    desc: "A sailor uses a magical conch to calm raging seas.",
    color: "from-blue-400 to-teal-600",
    totalPages: 50,
    pages: [
      ["The Stormy Deck", "Sailor Marin wielded a conch that sang to seas, calming storms in a turbulent ocean."],
      ["The Raging Tides", "The seas roared, sinking ships, cursed by a sea serpent’s wrath."],
      ["The First Note", "Marin’s conch sang, revealing a Tidecore, a gem to soothe the seas, hidden in a reef."],
      ["The Serpent’s Fury", "Serpent Voryn sought the Tidecore to rule the oceans, her waves chasing Marin."],
      ["A Brave Song", "Marin’s conch calmed Voryn’s wave, her heart steady under the serpent’s glare."],
      ["The Conch’s Vision", "The conch showed a coral maze where the Tidecore hid, guiding Marin’s ship."],
      ["A Rival Sailor", "Kael, a rival, stole Marin’s sea-charm, aiming to claim the Tidecore for Voryn."],
      ["A Clever Current", "Marin sang a decoy note, misleading Kael, her conch’s vision leading her to safety."],
      ["A Funny Mishap", "Marin’s conch summoned a dancing dolphin, amusing her crew with its flips."],
      ["The Reef’s Guardian", "A pearl-turtle guarded the Tidecore, demanding Marin sing a song of peace."],
      ["A Test of Harmony", "Marin sang her port’s lullabies, her harmony earning the turtle’s trust."],
      ["The Second Note", "The turtle gifted Marin a star-note, its song revealing the Tidecore’s lair."],
      ["Voryn’s Trap", "Voryn’s whirlpool trapped Marin, but her star-note calmed the waters."],
      ["The Lair’s Glow", "The lair shone with pearls, guiding Marin to the Tidecore."],
      ["Kael’s Betrayal", "Kael, now Voryn’s ally, sang a storm-note, twisting Marin’s songs."],
      ["A Twist Revealed", "Kael was Marin’s brother, lost to Voryn’s lies, seeking to outsail her."],
      ["The Climax", "In the Tidecore’s lair, Marin faced Kael, her conch weaving their past, softening his heart."],
      ["Calming the Seas", "Marin touched the Tidecore, its light soothing the seas, ships sailing safely."],
      ["Kael’s Redemption", "Kael joined Marin, his songs now calming tides, his heart healed."],
      ["The Turtle’s Gift", "The pearl-turtle gave Marin a sea-shell, enhancing her conch’s magic."],
      ["A New Sea", "A sea signaled Marin, its waves raging, needing her conch."],
      ["The Deck’s Light", "Marin’s deck glowed, its planks alive with the ocean’s thanks."],
      ["Kael’s Role", "Kael became Marin’s partner, his songs aiding the seas’ peace."],
      ["The Tidecore’s Song", "The Tidecore sang, guiding Marin to new storms."],
      ["The Sea’s Hope", "Marin’s conch calmed the sea, its waves gentle again."],
      ["A Funny Incident", "Marin’s shell summoned a singing crab, amusing sailors."],
      ["The Turtle’s Trust", "The turtle named Marin the Tidecaller, her conch legendary."],
      ["Kael’s Peace", "Kael found peace, his songs weaving hope."],
      ["The Sea’s Gift", "The sea gifted Marin a pearl-locket, its glow echoing thanks."],
      ["The Tidecore’s Vision", "The Tidecore showed visions of raging seas needing Marin."],
      ["The Deck’s Song", "The deck sang, soothing Marin as she sailed."],
      ["A Twist of Fate", "Marin found a note showing her as the Tidecore’s keeper, destined to calm."],
      ["The Sea’s Future", "The sea thrived, its sailors now singers under Marin."],
      ["The Turtle’s Legacy", "The turtle gifted Marin a star-shell, enhancing precision."],
      ["A New Storm", "A new storm signaled Marin, its waves spreading."],
      ["The Tidecore’s Oath", "Marin swore to calm all seas, her heart tied to the Tidecore."],
      ["The Reef’s Song", "The reef sang, a tribute to Marin’s courage."],
      ["Kael’s Gift", "Kael crafted a sea-note for Marin, its light glowing."],
      ["The Sea’s Heart", "The sea’s gratitude grew, its waves vibrant."],
      ["The Tidecore’s Peace", "The Tidecore restored peace, its light eternal."],
      ["A New Wave", "A distant wave signaled Marin, its storms needing her touch."],
      ["The Deck’s Future", "The deck glowed, ready for new songs."],
      ["A Child’s Dream", "A child dreamed of sailing with Marin, her conch glowing."],
      ["The Turtle’s Future", "The turtle shone brighter, guiding Marin."],
      ["A Funny Incident", "Marin’s conch summoned a hopping fish, amusing the crew."],
      ["The Tidecore’s Legacy", "The Tidecore guided Marin, its light eternal."],
      ["The Reef’s Future", "The reef glowed, ready for Marin’s songs."],
      ["Kael’s Future", "Kael vowed to sing with Marin, their bond eternal."],
      ["The Final Scene", "Marin stood on her deck, Tidecore glowing, ready to sing the next sea calm."]
    ]
  },
  {
    title: "The Emberheart Bard",
    desc: "A bard sings with a magical lute to ignite hope in a dark land.",
    color: "from-orange-400 to-red-600",
    totalPages: 50,
    pages: [
      ["The Firelit Stage", "Bard Talon played a lute that sparked hope, his songs warming a land gripped by despair."],
      ["The Shadowed Land", "The land dimmed, its people hopeless, cursed by a gloom wraith’s song."],
      ["The First Chord", "Talon’s lute struck a chord that glowed, revealing an Embercore, a gem to ignite hope."],
      ["The Wraith’s Dirge", "Wraith Sable sought the Embercore to snuff all hope, her dirges chasing Talon’s tunes."],
      ["A Bold Melody", "Talon’s song scattered Sable’s gloom, his heart steady under her wail."],
      ["The Lute’s Vision", "The lute showed a fire-mountain where the Embercore hid, guiding Talon’s strings."],
      ["A Rival Bard", "Vera, a rival, stole Talon’s spark-string, aiming to claim the Embercore for Sable."],
      ["A Clever Tune", "Talon played a decoy chord, misleading Vera, his lute’s vision leading him to safety."],
      ["A Funny Mishap", "Talon’s lute summoned a dancing flame, amusing villagers with its twirls."],
      ["The Mountain’s Guardian", "A fire-phoenix guarded the Embercore, demanding Talon sing a song of courage."],
      ["A Test of Valor", "Talon sang his town’s bravery, his valor earning the phoenix’s trust."],
      ["The Second Chord", "The phoenix gifted Talon a flame-string, its glow revealing the Embercore’s peak."],
      ["Sable’s Trap", "Sable’s dirges trapped Talon, but his flame-string burned a path."],
      ["The Peak’s Glow", "The peak shone with embers, guiding Talon to the Embercore."],
      ["Vera’s Betrayal", "Vera, now Sable’s ally, sang a gloom-chord, twisting Talon’s melodies."],
      ["A Twist Revealed", "Vera was Talon’s sister, lost to Sable’s lies, seeking to outsing him."],
      ["The Climax", "In the Embercore’s peak, Talon faced Vera, his song weaving their past, softening her heart."],
      ["Igniting Hope", "Talon touched the Embercore, its light sparking hope, the land glowing again."],
      ["Vera’s Redemption", "Vera joined Talon, her songs now igniting hearts, her heart healed."],
      ["The Phoenix’s Gift", "The fire-phoenix gave Talon a spark-string, enhancing his lute’s magic."],
      ["A New Land", "A land signaled Talon, its hope fading, needing his songs."],
      ["The Stage’s Light", "Talon’s stage glowed, its flames alive with the land’s thanks."],
      ["Vera’s Role", "Vera became Talon’s partner, her songs aiding hope’s spread."],
      ["The Embercore’s Song", "The Embercore sang, guiding Talon to new glooms."],
      ["The Land’s Hope", "Talon’s song restored the land, its people vibrant."],
      ["A Funny Incident", "Talon’s string summoned a hopping spark, amusing children."],
      ["The Phoenix’s Trust", "The phoenix named Talon the Emberheart, his lute legendary."],
      ["Vera’s Peace", "Vera found peace, her songs weaving hope."],
      ["The Land’s Gift", "The land gifted Talon a flame-locket, its glow echoing thanks."],
      ["The Embercore’s Vision", "The Embercore showed visions of dim lands needing Talon."],
      ["The Stage’s Song", "The stage sang, soothing Talon as he played."],
      ["A Twist of Fate", "Talon found a chord showing him as the Embercore’s keeper, destined to sing."],
      ["The Land’s Future", "The land thrived, its people now bards under Talon."],
      ["The Phoenix’s Legacy", "The phoenix gifted Talon a star-string, enhancing precision."],
      ["A New Gloom", "A new gloom signaled Talon, its shadows spreading."],
      ["The Embercore’s Oath", "Talon swore to ignite all hopes, his heart tied to the Embercore."],
      ["The Mountain’s Song", "The mountain sang, a tribute to Talon’s courage."],
      ["Vera’s Gift", "Vera crafted a flame-chord for Talon, its light glowing."],
      ["The Land’s Heart", "The land’s gratitude grew, its people vibrant."],
      ["The Embercore’s Peace", "The Embercore restored peace, its light eternal."],
      ["A New Song", "A distant song signaled Talon, its hope needing his touch."],
      ["The Stage’s Future", "The stage glowed, ready for new songs."],
      ["A Child’s Dream", "A child dreamed of singing with Talon, her lute glowing."],
      ["The Phoenix’s Future", "The phoenix shone brighter, guiding Talon."],
      ["A Funny Incident", "Talon’s lute summoned a dancing ember, amusing the land."],
      ["The Embercore’s Legacy", "The Embercore guided Talon, its light eternal."],
      ["The Mountain’s Future", "The mountain glowed, ready for Talon’s songs."],
      ["Vera’s Future", "Vera vowed to sing with Talon, their bond eternal."],
      ["The Final Scene", "Talon stood on his stage, Embercore glowing, ready to sing the next hope alight."]
    ]
  },
  {
    title: "The Mistwalker’s Lantern",
    desc: "A guide uses a magical lantern to lead lost souls through fog.",
    color: "from-gray-400 to-blue-600",
    totalPages: 50,
    pages: [
      ["The Fogbound Path", "Guide Lira carried a lantern that pierced fog, leading lost souls through a misty realm."],
      ["The Vanished Travelers", "Travelers vanished in the fog, their souls trapped by a mist wraith’s curse."],
      ["The First Glow", "Lira’s lantern glowed, revealing a Mistcore, a gem to free souls, hidden in a swamp."],
      ["The Wraith’s Veil", "Wraith Shroud sought the Mistcore to trap all souls, her fog chasing Lira’s light."],
      ["A Brave Beam", "Lira’s lantern scattered Shroud’s mist, her heart steady under the wraith’s gaze."],
      ["The Lantern’s Vision", "The lantern showed a bog where the Mistcore hid, guiding Lira’s steps."],
      ["A Rival Guide", "Toren, a rival, stole Lira’s mist-charm, aiming to claim the Mistcore for Shroud."],
      ["A Clever Light", "Lira shone a decoy beam, misleading Toren, her lantern’s vision leading her to safety."],
      ["A Funny Mishap", "Lira’s lantern summoned a dancing wisp, amusing travelers with its twirls."],
      ["The Bog’s Guardian", "A fog-stag guarded the Mistcore, demanding Lira shine a light of trust."],
      ["A Test of Faith", "Lira shone her town’s hope, her faith earning the stag’s trust."],
      ["The Second Glow", "The stag gifted Lira a star-beam, its light revealing the Mistcore’s lair."],
      ["Shroud’s Trap", "Shroud’s fog trapped Lira, but her star-beam cleared a path."],
      ["The Lair’s Shine", "The lair glowed with mist, guiding Lira to the Mistcore."],
      ["Toren’s Betrayal", "Toren, now Shroud’s ally, shone a shadow-beam, twisting Lira’s lights."],
      ["A Twist Revealed", "Toren was Lira’s brother, lost to Shroud’s lies, seeking to outguide her."],
      ["The Climax", "In the Mistcore’s lair, Lira faced Toren, her lantern weaving their past, softening his heart."],
      ["Freeing Souls", "Lira touched the Mistcore, its light freeing souls, travelers returning."],
      ["Toren’s Redemption", "Toren joined Lira, his lights now guiding souls, his heart healed."],
      ["The Stag’s Gift", "The fog-stag gave Lira a mist-lens, enhancing her lantern’s magic."],
      ["A New Traveler", "A traveler signaled Lira, their soul lost, needing her lantern."],
      ["The Path’s Light", "Lira’s path glowed, its mists alive with travelers’ thanks."],
      ["Toren’s Role", "Toren became Lira’s partner, his lights aiding souls’ return."],
      ["The Mistcore’s Song", "The Mistcore sang, guiding Lira to new fogs."],
      ["The Traveler’s Hope", "Lira’s lantern freed the traveler, their soul calm again."],
      ["A Funny Incident", "Lira’s lens summoned a hopping mist-frog, amusing travelers."],
      ["The Stag’s Trust", "The stag named Lira blessed, the Mistwalker,guiding her path."],
      ["Toren’s Guidance", "Toren found peace, guiding hope with his lights."],
      ["The Traveler’s Gift", "The traveler offered a mist-locket, its glow echoing thanks."],
      ["The Mistcore’s Vision", "The Mistcore revealed visions of lost souls needing Lira."],
      ["The Path’s Song", "The path sang a song, soothing her as she led."],
      ["A Twist of Fate", "Lira discovered a beam showing her as the Mistcore’s keeper."],
      ["The Path’s Future", "The path thrived, its people now guides under Lira."],
      ["The Stag’s Legacy", "The stag gave a star-lens, enhancing her precision."],
      ["A New Fog", "A new fog signaled, its souls needing her touch."],
      ["The Mistcore’s Oath", "Lira swore an oath to guide all souls, tied to the Mistcore."],
      ["The Bog’s Song", "The bog sang a song, tribute to Lira’s courage."],
      ["Toren’s Gift", "Toren crafted a mist-light for her, its beam glowing."],
      ["The Traveler’s Heart", "The traveler’s gratitude grew, their souls vibrant."],
      ["The Mistcore’s Peace", "The Mistcore restored peace, its light eternal."],
      ["A New Soul", "A distant soul signaled, needing her guidance."],
      ["The Path’s Future", "The path glowed, ready for new lights."],
      ["A Child’s Dream", "A child dreamt of guiding with Lira, her light glowing."],
      ["The Stag’s Future", "The stag shone brighter, guiding her."],
      ["A Funny Incident", "Lira’s light led a dancing mist-bird, amusing all."],
      ["The Mistcore’s Legacy", "The Mistcore guided her, its light eternal."],
      ["The Bog’s Future", "The bog glowed, ready for Lira’s lights."],
      ["Toren’s Future", "Toren vowed to guide with her, their bond eternal."],
      ["The Final Scene", "Lira stood on her path, lantern aglow, guiding the next soul."]
    ]
  },
  {
    title: "The Dawnforge Sculptor",
    desc: "A sculptor carves dawn statues to banish eternal dusk.",
    color: "from-yellow-400 to-orange-600",
    totalPages: 50,
    pages: [
      ["The Twilight’s Chisel", "Sculptor Aria carved dawn stone, her chisel sparking light in a dusk-bound land."],
      ["The Endless Dusk", "The land dimmed, its dawn stolen, cursed by a night wraith’s veil."],
      ["The First Statue", "Aria’s statue glowed, revealing a Dawncore, a gem to restore light."],
      ["The Wraith’s Veil", "Wraith Noctis sought the Dawncore to deepen dusk, her shadows chasing Aria."],
      ["A Bold Carving", "Aria’s statue scattered Noctis’ veil, her heart steady under the wraith."],
      ["The Chisel’s Vision", "The chisel showed a sun-peak where the Dawncore hid, guiding Aria."],
      ["A Rival Sculptor", "Voren, a rival, stole Aria’s sun-stone, aiming to claim the Dawncore."],
      ["A Clever Statue", "Aria carved a decoy dawn, misleading Voren."],
      ["A Funny Incident", "Aria’s statue danced, amusing villagers with its glow."],
      ["The Peak’s Guardian", "A dawn-phoenix guarded, demanding a statue of hope."],
      ["A Test of Light", "Aria carved her town’s sunrise, her light earning trust."],
      ["The Second Statue", "The phoenix gifted a sun-chip, revealing the Dawncore’s lair."],
      ["Noctis’ Trap", "Noctis’ shadows trapped Aria, but her sun-chip shone a path."],
      ["The Lair’s Shine", "The lair glowed, guiding Aria to the Dawncore."],
      ["Voren’s Betrayal", "Voren, now Noctis’ ally, carved a shadow-statue."],
      ["A Twist Revealed", "Voren was Aria’s brother, lost to Noctis’ lies."],
      ["The Climax", "Aria faced Voren, her statue weaving their past."],
      ["Restoring Dawn", "Aria touched the Dawncore, its light banishing dusk."],
      ["Voren’s Redemption", "Voren joined Aria, carving light."],
      ["The Phoenix’s Gift", "The phoenix gave a sun-flake, enhancing her chisel."],
      ["A New Land", "A land signaled, needing dawn statues."],
      ["The Chisel’s Light", "Aria’s torch glowed, alive with thanks."],
      ["Voren’s Role", "Voren aided, his statues bright."],
      ["The Dawncore’s Song", "The Dawncore sang, guiding Aria."],
      ["The Land’s Hope", "Aria restored the land, dawn vibrant."],
      ["A Funny Incident", "Aria’s statue sparked a glowing bird."],
      ["The Phoenix’s Trust", "The phoenix named Aria Dawnforge."],
      ["Voren’s Peace", "Voren found peace, carving hope."],
      ["The Land’s Gift", "The land gave a sun-locket."],
      ["The Dawncore’s Vision", "Visions of dim lands appeared."],
      ["The Chisel’s Song", "The sky sang, soothing her."],
      ["A Twist of Fate", "Aria was the Dawncore’s keeper."],
      ["The Land’s Future", "The land thrived, sculptors under Aria."],
      ["The Phoenix’s Legacy", "The phoenix gave a star-chip."],
      ["A New Dusk", "A dusk signaled Aria."],
      ["The Dawncore’s Oath", "Aria swore to carve light."],
      ["The Peak’s Song", "The peak sang, tribute."],
      ["Voren’s Gift", "Voren crafted a sun-stone."],
      ["The Veil’s Heart", "The land’s gratitude grew."],
      ["The Dawncore’s Peace", "The Dawncore restored peace."],
      ["A New Light", "A light signaled."],
      ["The Chisel’s Future", "The forge glowed."],
      ["A Child’s Dream", "A child dreamt of sculpting."],
      ["The Phoenix’s Future", "The phoenix shone."],
      ["A Funny Event", "Aria’s statue danced a star."],
      ["The Dawncore’s Legacy", "The Dawncore led."],
      ["The Peak’s Future", "The peak glowed."],
      ["Voren’s Future", "Voren carved with Aria."],
      ["The Final Scene", "Aria stood, chisel aglow, crafting dawn’s next statue."]
    ]
  },
  {
    title: "The Starweave Tailor",
    desc: "A tailor stitches starlight into clothes to heal a darkened realm.",
    color: "from-purple-400 to-blue-600",
    totalPages: 50,
    pages: [
      ["The Starlit Atelier", "Tailor Elowen stitched starlight into garments, healing hearts in a darkened realm."],
      ["The Fading Stars", "The realm’s stars dimmed, its people joyless, cursed by a shadow wraith."],
      ["The First Stitch", "Elowen’s needle glowed, sewing a cloak that revealed a Starweave, a gem to restore light."],
      ["The Wraith’s Gloom", "Wraith Umbra sought the Starweave to darken all, her shadows chasing Elowen."],
      ["A Bright Seam", "Elowen’s cloak scattered Umbra’s gloom, her heart steady."],
      ["The Needle’s Vision", "The needle showed a star-reef where the Starweave hid."],
      ["A Rival Tailor", "Soren, a rival, stole Elowen’s star-thread."],
      ["A Clever Stitch", "Elowen sewed a decoy seam, misleading Soren."],
      ["A Funny Mishap", "Elowen’s cloak danced, amusing villagers."],
      ["The Reef’s Guardian", "A starfish demanded a garment of hope."],
      ["A Test of Light", "Elowen stitched her town’s joy."],
      ["The Second Thread", "The starfish gave a star-strand."],
      ["Umbra’s Trap", "Umbra’s shadows trapped Elowen."],
      ["The Lair’s Shine", "The lair glowed with starlight."],
      ["Soren’s Betrayal", "Soren, now Umbra’s ally."],
      ["A Twist Revealed", "Soren was Elowen’s cousin."],
      ["The Climax", "Elowen faced Soren, sewing their past."],
      ["Restoring Starlight", "Elowen touched the Starweave."],
      ["Soren’s Redemption", "Soren joined Elowen."],
      ["The Starfish’s Gift", "The Starfish gave a star-needle."],
      ["A New Realm", "A realm signaled Elowen."],
      ["The Atelier’s Light", "Elowen’s atelier glowed."],
      ["Soren’s Role", "Soren aided Elowen."],
      ["The Starweave’s Song", "The Starweave sang."],
      ["The Realm’s Hope", "Elowen’s cloak restored."],
      ["A Funny Incident", "Elowen’s thread sparkled."],
      ["The Starfish’s Trust", "The starfish named Elowen Starweave."],
      ["Soren’s Peace", "Soren found peace."],
      ["The Realm’s Gift", "The realm gave a star-locket."],
      ["The Starweave’s Vision", "The Starweave showed visions."],
      ["The Atelier’s Song", "The atelier sang."],
      ["A Twist of Fate", "Elowen was the Starweave’s keeper."],
      ["The Realm’s Future", "The realm thrived."],
      ["The Starfish’s Legacy", "The starfish gave a star-thread."],
      ["A New Star", "A star dimmed."],
      ["The Starweave’s Oath", "Elowen swore to sew light."],
      ["The Reef’s Song", "The reef sang."],
      ["Soren’s Gift", "Soren crafted a star-seam."],
      ["The Realm’s Heart", "The realm’s gratitude grew."],
      ["The Starweave’s Peace", "The Starweave restored peace."],
      ["A New Light", "A light signaled."],
      ["The Atelier’s Future", "The atelier glowed."],
      ["A Child’s Dream", "A child dreamt of sewing."],
      ["The Starfish’s Glow", "The starfish shone."],
      ["A Funny Event", "Elowen’s cloak danced."],
      ["The Starweave’s Legacy", "The Starweave led."],
      ["The Reef’s Light", "The reef glowed."],
      ["Soren’s Future", "Soren sewed with Elowen."],
      ["The Final Scene", "Elowen stood, needle aglow, sewing starlight."]
    ]
  },
  {
  title: "The Skywhisperer’s Flute",
  desc: "A flutist plays songs to calm sky spirits in a turbulent realm.",
  color: "from-cyan-400 to-indigo-600",
  totalPages: 50,
  pages: [
    ["The Windborne Loft", "Flutist Lyra played a melody to sky spirits, calming skies in a stormy realm."],
    ["The Raging Clouds", "The skies raged, spirits unrested, cursed by a storm wraith."],
    ["The First Note", "Lyra’s flute sang, revealing a Skyheart, a gem to soothe spirits."],
    ["The Wraith’s Tempest", "Wraith Zephyr sought the Skyheart to rule skies."],
    ["A Bold Melody", "Lyra’s song calmed Zephyr’s storm, her heart steady despite the wraith’s howling winds."],
    ["The Flute’s Vision", "The flute showed a cloud-peak where the Skyheart pulsed, its melody guiding Lyra’s path."],
    ["A Rival Flutist", "Toren, a rival flutist, stole Lyra’s sky-reed, aiming to claim the Skyheart for Zephyr’s dominion."],
    ["A Clever Song", "Lyra played a decoy note, its tune misleading Toren, her flute’s vision leading her through the clouds."],
    ["A Funny Mishap", "Lyra’s song summoned a dancing cloud that puffed into a sheep shape, amusing her crew with its baa-like gusts."],
    ["The Peak’s Guardian", "A sky-hawk guarded the Skyheart, demanding Lyra play a song of peace to prove her intent."],
    ["A Test of Harmony", "Lyra played her town’s lullabies, her notes weaving calm, earning the hawk’s trust."],
    ["The Second Note", "The hawk gifted Lyra a star-reed, its glow revealing the Skyheart’s hidden lair atop the peak."],
    ["Zephyr’s Trap", "Zephyr’s winds trapped Lyra in a vortex, but her star-reed’s song parted the storm."],
    ["The Lair’s Glow", "The lair shone with clouds, their light guiding Lyra to the Skyheart’s radiant core."],
    ["Toren’s Betrayal", "Toren, now Zephyr’s ally, played a discordant tune, twisting Lyra’s melodies into chaos."],
    ["A Twist Revealed", "Toren was Lyra’s brother, estranged by jealousy, seeking to outplay her to win Zephyr’s favor."],
    ["The Skyheart’s Call", "The Skyheart pulsed, its song urging Lyra to face Toren with harmony, not discord."],
    ["A Song of Bonds", "Lyra played a melody of their childhood, her notes softening Toren’s heart, breaking Zephyr’s hold."],
    ["Zephyr’s Wrath", "Zephyr descended, her storm raging, threatening to shatter the Skyheart and rule the skies forever."],
    ["The Climax", "In the lair, Lyra and Toren played together, their duet channeling the Skyheart to banish Zephyr’s curse."],
    ["Calming the Skies", "The Skyheart’s light spread, soothing the sky spirits, restoring peace to the turbulent realm."],
    ["Toren’s Redemption", "Toren vowed to play with Lyra, his flute now weaving hope, his heart healed by her forgiveness."],
    ["The Hawk’s Gift", "The sky-hawk gifted Lyra a cloud-feather, enhancing her flute’s ability to calm spirits."],
    ["A New Storm", "A distant sky signaled Lyra, its clouds raging, needing her soothing melodies."],
    ["The Loft’s Light", "Lyra’s loft glowed brighter, its walls humming with the realm’s gratitude."],
    ["Toren’s Role", "Toren became Lyra’s partner, his tunes aiding her in calming restless skies."],
    ["The Skyheart’s Song", "The Skyheart sang, its melody guiding Lyra to new tempests needing her touch."],
    ["The Storm’s Peace", "Lyra’s flute calmed the distant storm, its clouds parting to reveal starlit skies."],
    ["A Funny Incident", "Lyra’s feather summoned a cloud-bird that chirped a silly tune, amusing her crew."],
    ["The Hawk’s Trust", "The sky-hawk named Lyra the Skywhisperer, her flute a legend among the clouds."],
    ["Toren’s Peace", "Toren found peace, his melodies now a beacon of hope, played alongside Lyra."],
    ["The Realm’s Gift", "The realm gifted Lyra a star-locket, its glow echoing the skies’ thanks."],
    ["The Skyheart’s Vision", "The Skyheart showed visions of stormy realms, guiding Lyra to her next mission."],
    ["The Loft’s Song", "The loft sang a lullaby, soothing Lyra as she prepared for new journeys."],
    ["A Twist of Fate", "Lyra found a note in her flute, revealing she crafted the Skyheart in a past life."],
    ["The Realm’s Future", "The realm thrived, its people learning to play flutes under Lyra’s guidance."],
    ["The Hawk’s Legacy", "The hawk gifted Lyra a star-plume, enhancing her flute’s precision."],
    ["A New Spirit", "A sky spirit signaled Lyra, its unrest stirring new clouds, needing her song."],
    ["The Skyheart’s Oath", "Lyra swore to calm all skies, her heart tied to the Skyheart’s light."],
    ["The Peak’s Song", "The cloud-peak sang, its winds a chorus honoring Lyra’s courage."],
    ["Toren’s Gift", "Toren crafted a sky-reed for Lyra, its notes pulsing with hope."],
    ["The Realm’s Heart", "The realm’s gratitude grew, its skies vibrant with peace."],
    ["The Skyheart’s Peace", "The Skyheart restored eternal calm, its light a beacon for all skies."],
    ["A New Melody", "A distant melody signaled Lyra, its notes needing her flute’s touch."],
    ["The Loft’s Future", "The loft glowed, ready for new songs to soothe the skies."],
    ["A Child’s Dream", "A child dreamed of playing with Lyra, her flute glowing with potential."],
    ["The Hawk’s Future", "The sky-hawk soared brighter, guiding Lyra to new tempests."],
    ["A Funny Incident", "Lyra’s plume summoned a cloud-crab that danced, amusing the realm with its antics."],
    ["The Skyheart’s Legacy", "The Skyheart’s light guided Lyra, its song eternal."],
    ["The Final Scene", "Lyra stood in her loft, Skyheart glowing, ready to play the next melody for the skies."]
  ]
},
  {
    title: "The Crystal Gardener",
    desc: "A gardener grows crystal flowers to heal a shattered realm.",
    color: "from-emerald-400 to-teal-600",
    totalPages: 50,
    pages: [
      ["The Shimmering Grove", "Gardener Liora tended crystal flowers, their petals healing a realm fractured by a shadow blight."],
      ["The Broken Lands", "The realm’s earth cracked, its colors fading, cursed by a blight wraith’s touch."],
      ["The First Bloom", "Liora’s crystal rose bloomed, revealing a Bloomcore, a gem to mend the land."],
      ["The Wraith’s Curse", "Wraith Thorn sought the Bloomcore to shatter all, her roots choking Liora’s grove."],
      ["A Bold Planting", "Liora’s rose dissolved Thorn’s roots, her heart steady under the wraith’s glare."],
      ["The Rose’s Vision", "The rose showed a crystal valley where the Bloomcore hid, guiding Liora’s trowel."],
      ["A Rival Gardener", "Veyra, a rival, stole Liora’s crystal seeds, aiming to claim the Bloomcore for Thorn."],
      ["A Clever Sprout", "Liora planted a decoy flower, misleading Veyra, her rose’s vision leading to safety."],
      ["A Funny Mishap", "Liora’s seed grew a crystal butterfly that fluttered in circles, amusing villagers."],
      ["The Valley’s Guardian", "A jade stag guarded the Bloomcore, demanding Liora grow a flower of hope."],
      ["A Test of Care", "Liora grew her village’s joy, her care earning the stag’s trust."],
      ["The Second Bloom", "The stag gifted a star-petal, its glow revealing the Bloomcore’s lair."],
      ["Thorn’s Trap", "Thorn’s vines trapped Liora, but her star-petal cleared a path."],
      ["The Lair’s Shine", "The lair sparkled with crystals, guiding Liora to the Bloomcore."],
      ["Veyra’s Betrayal", "Veyra, now Thorn’s ally, grew a thorn-flower, twisting Liora’s blooms."],
      ["A Twist Revealed", "Veyra was Liora’s sister, envious of her skill, seeking to outgrow her."],
      ["The Bloomcore’s Call", "The Bloomcore pulsed, urging Liora to face Veyra with love, not rivalry."],
      ["A Flower of Bonds", "Liora grew a crystal vine of their past, softening Veyra’s heart, breaking Thorn’s hold."],
      ["Thorn’s Wrath", "Thorn’s roots surged, threatening to crush the Bloomcore and shatter the realm."],
      ["The Climax", "In the lair, Liora and Veyra planted together, their flowers channeling the Bloomcore to banish Thorn."],
      ["Mending the Realm", "Liora touched the Bloomcore, its light healing the land, cracks sealing."],
      ["Veyra’s Redemption", "Veyra joined Liora, her flowers now mending hearts, her heart healed."],
      ["The Stag’s Gift", "The jade stag gave Liora a crystal bud, enhancing her garden’s magic."],
      ["A New Land", "A land signaled Liora, its soil barren, needing her crystal flowers."],
      ["The Grove’s Light", "Liora’s grove glowed, its petals alive with the realm’s thanks."],
      ["Veyra’s Role", "Veyra became Liora’s partner, her flowers aiding the land’s recovery."],
      ["The Bloomcore’s Song", "The Bloomcore sang, guiding Liora to new blights."],
      ["The Land’s Hope", "Liora’s flower healed the land, its fields vibrant again."],
      ["A Funny Incident", "Liora’s bud grew a dancing crystal frog, amusing villagers."],
      ["The Stag’s Trust", "The stag named Liora the Crystal Gardener, her trowel legendary."],
      ["Veyra’s Peace", "Veyra found peace, her flowers weaving hope."],
      ["The Land’s Gift", "The land gifted Liora a crystal locket, its glow echoing thanks."],
      ["The Bloomcore’s Vision", "The Bloomcore showed visions of barren lands needing Liora."],
      ["The Grove’s Song", "The grove sang, soothing Liora as she planted."],
      ["A Twist of Fate", "Liora found a petal showing her as the Bloomcore’s keeper, destined to heal."],
      ["The Land’s Future", "The land thrived, its people now gardeners under Liora."],
      ["The Stag’s Legacy", "The stag gifted a star-seed, enhancing her precision."],
      ["A New Blight", "A blight signaled Liora, its shadows spreading."],
      ["The Bloomcore’s Oath", "Liora swore to heal all lands, her heart tied to the Bloomcore."],
      ["The Valley’s Song", "The valley sang, a tribute to Liora’s courage."],
      ["Veyra’s Gift", "Veyra grew a crystal rose for Liora, its light glowing."],
      ["The Land’s Heart", "The land’s gratitude grew, its fields vibrant."],
      ["The Bloomcore’s Peace", "The Bloomcore restored peace, its light eternal."],
      ["A New Soil", "A distant soil signaled Liora, its cracks needing her touch."],
      ["The Grove’s Future", "The grove glowed, ready for new flowers."],
      ["A Child’s Dream", "A child dreamed of gardening with Liora, her seeds glowing."],
      ["The Stag’s Future", "The stag shone brighter, guiding Liora."],
      ["A Funny Incident", "Liora’s seed grew a hopping crystal beetle, amusing the land."],
      ["The Bloomcore’s Legacy", "The Bloomcore guided Liora, its light eternal."],
      ["The Final Scene", "Liora stood in her grove, Bloomcore glowing, ready to grow the next flower of healing."]
    ]
  },
  {
    title: "The Emberwhisper Painter",
    desc: "A painter uses fiery brushes to restore a burning world.",
    color: "from-red-400 to-orange-600",
    totalPages: 50,
    pages: [
      ["The Blazing Studio", "Painter Kael wielded brushes that sparked embers, restoring a world consumed by eternal flames."],
      ["The Burning Lands", "The world burned, its colors ashen, cursed by a flame wraith’s wrath."],
      ["The First Stroke", "Kael’s brush painted a flame that revealed an Embercore, a gem to quell the fires."],
      ["The Wraith’s Inferno", "Wraith Pyre sought the Embercore to fuel the flames, her sparks chasing Kael."],
      ["A Bold Canvas", "Kael’s painting doused Pyre’s sparks, his heart steady under the wraith’s heat."],
      ["The Brush’s Vision", "The brush showed a fire-cave where the Embercore hid, guiding Kael’s strokes."],
      ["A Rival Painter", "Saria, a rival, stole Kael’s ember-paint, aiming to claim the Embercore for Pyre."],
      ["A Clever Hue", "Kael painted a decoy flame, misleading Saria, his brush’s vision leading to safety."],
      ["A Funny Mishap", "Kael’s brush painted a dancing spark that twirled like a firefly, amusing villagers."],
      ["The Cave’s Guardian", "A flame-wolf guarded the Embercore, demanding Kael paint a scene of peace."],
      ["A Test of Calm", "Kael painted his village’s cool springs, his calm earning the wolf’s trust."],
      ["The Second Stroke", "The wolf gifted a star-ember, its glow revealing the Embercore’s lair."],
      ["Pyre’s Trap", "Pyre’s flames trapped Kael, but his star-ember painted a path."],
      ["The Lair’s Glow", "The lair shone with embers, guiding Kael to the Embercore."],
      ["Saria’s Betrayal", "Saria, now Pyre’s ally, painted a blaze-storm, twisting Kael’s hues."],
      ["A Twist Revealed", "Saria was Kael’s mentor, corrupted by Pyre, seeking to outpaint him."],
      ["The Embercore’s Call", "The Embercore pulsed, urging Kael to face Saria with art, not rivalry."],
      ["A Canvas of Bonds", "Kael painted their shared lessons, softening Saria’s heart, breaking Pyre’s hold."],
      ["Pyre’s Fury", "Pyre’s inferno surged, threatening to consume the Embercore and burn the world."],
      ["The Climax", "In the lair, Kael and Saria painted together, their art channeling the Embercore to douse Pyre."],
      ["Quelling the Flames", "Kael touched the Embercore, its light cooling the world, colors returning."],
      ["Saria’s Redemption", "Saria joined Kael, her paintings now soothing hearts, her heart healed."],
      ["The Wolf’s Gift", "The flame-wolf gave Kael a spark-brush, enhancing his art’s magic."],
      ["A New Fire", "A land signaled Kael, its flames spreading, needing his paintings."],
      ["The Studio’s Light", "Kael’s studio glowed, its canvases alive with the world’s thanks."],
      ["Saria’s Role", "Saria became Kael’s partner, her brushes aiding the world’s cooling."],
      ["The Embercore’s Song", "The Embercore sang, guiding Kael to new fires."],
      ["The Land’s Hope", "Kael’s painting cooled the land, its fields vibrant again."],
      ["A Funny Incident", "Kael’s brush painted a hopping flame-toad, amusing villagers."],
      ["The Wolf’s Trust", "The wolf named Kael the Emberwhisper, his brush legendary."],
      ["Saria’s Peace", "Saria found peace, her paintings weaving hope."],
      ["The Land’s Gift", "The land gifted Kael a flame-locket, its glow echoing thanks."],
      ["The Embercore’s Vision", "The Embercore showed visions of burning lands needing Kael."],
      ["The Studio’s Song", "The studio sang, soothing Kael as he painted."],
      ["A Twist of Fate", "Kael found a stroke showing him as the Embercore’s keeper, destined to cool."],
      ["The Land’s Future", "The land thrived, its people now painters under Kael."],
      ["The Wolf’s Legacy", "The wolf gifted a star-spark, enhancing his precision."],
      ["A New Flame", "A flame signaled Kael, its fires spreading."],
      ["The Embercore’s Oath", "Kael swore to cool all worlds, his heart tied to the Embercore."],
      ["The Cave’s Song", "The cave sang, a tribute to Kael’s courage."],
      ["Saria’s Gift", "Saria painted a flame-hue for Kael, its light glowing."],
      ["The Land’s Heart", "The land’s gratitude grew, its colors vibrant."],
      ["The Embercore’s Peace", "The Embercore restored peace, its light eternal."],
      ["A New Canvas", "A distant fire signaled Kael, its flames needing his touch."],
      ["The Studio’s Future", "The studio glowed, ready for new paintings."],
      ["A Child’s Dream", "A child dreamed of painting with Kael, his brushes glowing."],
      ["The Wolf’s Future", "The wolf shone brighter, guiding Kael."],
      ["A Funny Incident", "Kael’s brush painted a dancing ember-crab, amusing the land."],
      ["The Embercore’s Legacy", "The Embercore guided Kael, its light eternal."],
      ["The Final Scene", "Kael stood in his studio, Embercore glowing, ready to paint the next cooling hue."]
    ]
  },
  {
    title: "The Moonveil Seamstress",
    desc: "A seamstress weaves moonlit threads to mend a torn sky.",
    color: "from-silver-400 to-purple-600",
    totalPages: 50,
    pages: [
      ["The Lunar Loom", "Seamstress Selene wove moonlit threads, mending a sky torn by a void wraith’s claws."],
      ["The Ripped Heavens", "The sky bled starlight, its constellations fading, cursed by a wraith’s tear."],
      ["The First Thread", "Selene’s needle glowed, weaving a veil that revealed a Mooncore, a gem to mend the sky."],
      ["The Wraith’s Rift", "Wraith Nyx sought the Mooncore to tear all skies, her voids chasing Selene."],
      ["A Bold Stitch", "Selene’s veil patched Nyx’s rift, her heart steady under the wraith’s gaze."],
      ["The Needle’s Vision", "The needle showed a moon-crater where the Mooncore hid, guiding Selene’s threads."],
      ["A Rival Seamstress", "Lira, a rival, stole Selene’s star-thread, aiming to claim the Mooncore for Nyx."],
      ["A Clever Seam", "Selene wove a decoy veil, misleading Lira, her needle’s vision leading to safety."],
      ["A Funny Mishap", "Selene’s thread wove a dancing moon-moth, amusing villagers with its glow."],
      ["The Crater’s Guardian", "A lunar owl guarded the Mooncore, demanding Selene weave a veil of hope."],
      ["A Test of Light", "Selene wove her village’s starlight, her light earning the owl’s trust."],
      ["The Second Thread", "The owl gifted a star-strand, its glow revealing the Mooncore’s lair."],
      ["Nyx’s Trap", "Nyx’s voids trapped Selene, but her star-strand patched a path."],
      ["The Lair’s Shine", "The lair glowed with moonlight, guiding Selene to the Mooncore."],
      ["Lira’s Betrayal", "Lira, now Nyx’s ally, wove a void-veil, twisting Selene’s threads."],
      ["A Twist Revealed", "Lira was Selene’s cousin, jealous of her skill, seeking to outsew her."],
      ["The Mooncore’s Call", "The Mooncore pulsed, urging Selene to face Lira with love, not rivalry."],
      ["A Veil of Bonds", "Selene wove their shared past, softening Lira’s heart, breaking Nyx’s hold."],
      ["Nyx’s Fury", "Nyx’s rifts surged, threatening to tear the Mooncore and shred the sky."],
      ["The Climax", "In the lair, Selene and Lira wove together, their veils channeling the Mooncore to seal Nyx."],
      ["Mending the Sky", "Selene touched the Mooncore, its light stitching the sky, stars shining again."],
      ["Lira’s Redemption", "Lira joined Selene, her veils now mending hearts, her heart healed."],
      ["The Owl’s Gift", "The lunar owl gave Selene a moon-thread, enhancing her loom’s magic."],
      ["A New Sky", "A sky signaled Selene, its stars fading, needing her veils."],
      ["The Loom’s Light", "Selene’s loom glowed, its threads alive with the sky’s thanks."],
      ["Lira’s Role", "Lira became Selene’s partner, her veils aiding the sky’s repair."],
      ["The Mooncore’s Song", "The Mooncore sang, guiding Selene to new rifts."],
      ["The Sky’s Hope", "Selene’s veil mended the sky, its constellations vibrant."],
      ["A Funny Incident", "Selene’s thread wove a hopping moon-frog, amusing villagers."],
      ["The Owl’s Trust", "The owl named Selene the Moonveil, her needle legendary."],
      ["Lira’s Peace", "Lira found peace, her veils weaving hope."],
      ["The Sky’s Gift", "The sky gifted Selene a star-locket, its glow echoing thanks."],
      ["The Mooncore’s Vision", "The Mooncore showed visions of torn skies needing Selene."],
      ["The Loom’s Song", "The loom sang, soothing Selene as she wove."],
      ["A Twist of Fate", "Selene found a thread showing her as the Mooncore’s keeper, destined to mend."],
      ["The Sky’s Future", "The sky thrived, its people now seamstresses under Selene."],
      ["The Owl’s Legacy", "The owl gifted a star-needle, enhancing her precision."],
      ["A New Rift", "A rift signaled Selene, its voids spreading."],
      ["The Mooncore’s Oath", "Selene swore to mend all skies, her heart tied to the Mooncore."],
      ["The Crater’s Song", "The crater sang, a tribute to Selene’s courage."],
      ["Lira’s Gift", "Lira wove a moon-veil for Selene, its light glowing."],
      ["The Sky’s Heart", "The sky’s gratitude grew, its stars vibrant."],
      ["The Mooncore’s Peace", "The Mooncore restored peace, its light eternal."],
      ["A New Star", "A distant star signaled Selene, its light needing her touch."],
      ["The Loom’s Future", "The loom glowed, ready for new veils."],
      ["A Child’s Dream", "A child dreamed of weaving with Selene, her threads glowing."],
      ["The Owl’s Future", "The owl shone brighter, guiding Selene."],
      ["A Funny Incident", "Selene’s thread wove a dancing moon-crab, amusing the sky."],
      ["The Mooncore’s Legacy", "The Mooncore guided Selene, its light eternal."],
      ["The Final Scene", "Selene stood at her loom, Mooncore glowing, ready to weave the next sky-mending veil."]
    ]
  },
  {
    title: "The Starforge Navigator",
    desc: "A navigator charts starlit paths to guide lost ships home.",
    color: "from-blue-400 to-indigo-600",
    totalPages: 50,
    pages: [
      ["The Celestial Helm", "Navigator Eryn charted starlit paths, guiding lost ships through a cosmos cursed by a void wraith."],
      ["The Lost Fleets", "Ships vanished in the void, their crews trapped, cursed by wraith Nebula’s darkness."],
      ["The First Star", "Eryn’s compass glowed, revealing a Starcore, a gem to guide ships home."],
      ["The Wraith’s Void", "Nebula sought the Starcore to trap all ships, her shadows chasing Eryn’s charts."],
      ["A Bold Course", "Eryn’s chart pierced Nebula’s void, her heart steady under the wraith’s gaze."],
      ["The Compass’s Vision", "The compass showed a star-nebula where the Starcore hid, guiding Eryn’s helm."],
      ["A Rival Navigator", "Toren, a rival, stole Eryn’s star-map, aiming to claim the Starcore for Nebula."],
      ["A Clever Path", "Eryn charted a decoy course, misleading Toren, her compass leading to safety."],
      ["A Funny Mishap", "Eryn’s map summoned a star-fish that swam in circles, amusing her crew."],
      ["The Nebula’s Guardian", "A cosmic whale guarded the Starcore, demanding Eryn chart a path of trust."],
      ["A Test of Faith", "Eryn charted her port’s hope, her faith earning the whale’s trust."],
      ["The Second Star", "The whale gifted a star-point, its glow revealing the Starcore’s lair."],
      ["Nebula’s Trap", "Nebula’s voids trapped Eryn, but her star-point charted a path."],
      ["The Lair’s Shine", "The lair glowed with stars, guiding Eryn to the Starcore."],
      ["Toren’s Betrayal", "Toren, now Nebula’s ally, charted a void-path, twisting Eryn’s maps."],
      ["A Twist Revealed", "Toren was Eryn’s brother, lost to Nebula’s lies, seeking to outnavigate her."],
      ["The Starcore’s Call", "The Starcore pulsed, urging Eryn to face Toren with guidance, not rivalry."],
      ["A Map of Bonds", "Eryn charted their shared voyages, softening Toren’s heart, breaking Nebula’s hold."],
      ["Nebula’s Fury", "Nebula’s voids surged, threatening to consume the Starcore and trap all ships."],
      ["The Climax", "In the lair, Eryn and Toren charted together, their maps channeling the Starcore to banish Nebula."],
      ["Guiding the Fleets", "Eryn touched the Starcore, its light guiding ships home, crews safe."],
      ["Toren’s Redemption", "Toren joined Eryn, his maps now guiding hope, his heart healed."],
      ["The Whale’s Gift", "The cosmic whale gave Eryn a star-compass, enhancing her navigation’s magic."],
      ["A New Fleet", "A fleet signaled Eryn, its ships lost, needing her charts."],
      ["The Helm’s Light", "Eryn’s helm glowed, its maps alive with the cosmos’s thanks."],
      ["Toren’s Role", "Toren became Eryn’s partner, his maps aiding ships’ return."],
      ["The Starcore’s Song", "The Starcore sang, guiding Eryn to new voids."],
      ["The Fleet’s Hope", "Eryn’s chart guided the fleet, its ships safe again."],
      ["A Funny Incident", "Eryn’s compass summoned a dancing star-crab, amusing the crew."],
      ["The Whale’s Trust", "The whale named Eryn the Starforge, her compass legendary."],
      ["Toren’s Peace", "Toren found peace, his maps weaving hope."],
      ["The Fleet’s Gift", "The fleet gifted Eryn a star-locket, its glow echoing thanks."],
      ["The Starcore’s Vision", "The Starcore showed visions of lost fleets needing Eryn."],
      ["The Helm’s Song", "The helm sang, soothing Eryn as she charted."],
      ["A Twist of Fate", "Eryn found a map showing her as the Starcore’s keeper, destined to guide."],
      ["The Fleet’s Future", "The fleet thrived, its sailors now navigators under Eryn."],
      ["The Whale’s Legacy", "The whale gifted a star-chart, enhancing her precision."],
      ["A New Void", "A void signaled Eryn, its ships lost."],
      ["The Starcore’s Oath", "Eryn swore to guide all fleets, her heart tied to the Starcore."],
      ["The Nebula’s Song", "The nebula sang, a tribute to Eryn’s courage."],
      ["Toren’s Gift", "Toren crafted a star-map for Eryn, its light glowing."],
      ["The Fleet’s Heart", "The fleet’s gratitude grew, its ships vibrant."],
      ["The Starcore’s Peace", "The Starcore restored peace, its light eternal."],
      ["A New Ship", "A distant ship signaled Eryn, its crew needing her touch."],
      ["The Helm’s Future", "The helm glowed, ready for new charts."],
      ["A Child’s Dream", "A child dreamed of navigating with Eryn, her maps glowing."],
      ["The Whale’s Future", "The whale shone brighter, guiding Eryn."],
      ["A Funny Incident", "Eryn’s map summoned a hopping star-fish, amusing the fleet."],
      ["The Starcore’s Legacy", "The Starcore guided Eryn, its light eternal."],
      ["The Final Scene", "Eryn stood at her helm, Starcore glowing, ready to chart the next path home."]
    ]
  },
  {
    title: "The Frostsong Harper",
    desc: "A harper plays icy melodies to thaw a frozen kingdom.",
    color: "from-cyan-400 to-blue-600",
    totalPages: 50,
    pages: [
      ["The Icy Strings", "Harper Veyra played a harp that sang frost, thawing a kingdom locked in eternal ice."],
      ["The Frozen Realm", "The kingdom froze, its people shivering, cursed by a frost wraith’s chill."],
      ["The First Note", "Veyra’s harp sang, revealing a Frostcore, a gem to melt the ice."],
      ["The Wraith’s Blizzard", "Wraith Glacia sought the Frostcore to freeze all, her snows chasing Veyra."],
      ["A Bold Melody", "Veyra’s song melted Glacia’s snow, her heart steady under the wraith’s chill."],
      ["The Harp’s Vision", "The harp showed an ice-peak where the Frostcore hid, guiding Veyra’s strings."],
      ["A Rival Harper", "Soren, a rival, stole Veyra’s ice-string, aiming to claim the Frostcore for Glacia."],
      ["A Clever Chord", "Veyra played a decoy note, misleading Soren, her harp’s vision leading to safety."],
      ["A Funny Mishap", "Veyra’s harp summoned a dancing snowflake, amusing villagers with its twirls."],
      ["The Peak’s Guardian", "An ice-bear guarded the Frostcore, demanding Veyra play a song of warmth."],
      ["A Test of Heart", "Veyra played her village’s hearths, her warmth earning the bear’s trust."],
      ["The Second Note", "The bear gifted a star-string, its glow revealing the Frostcore’s lair."],
      ["Glacia’s Trap", "Glacia’s blizzard trapped Veyra, but her star-string melted a path."],
      ["The Lair’s Shine", "The lair glowed with ice, guiding Veyra to the Frostcore."],
      ["Soren’s Betrayal", "Soren, now Glacia’s ally, played a frost-chord, twisting Veyra’s melodies."],
      ["A Twist Revealed", "Soren was Veyra’s mentor, corrupted by Glacia, seeking to outplay her."],
      ["The Frostcore’s Call", "The Frostcore pulsed, urging Veyra to face Soren with harmony, not rivalry."],
      ["A Song of Bonds", "Veyra played their shared lessons, softening Soren’s heart, breaking Glacia’s hold."],
      ["Glacia’s Fury", "Glacia’s ice surged, threatening to freeze the Frostcore and the kingdom."],
      ["The Climax", "In the lair, Veyra and Soren played together, their music channeling the Frostcore to banish Glacia."],
      ["Thawing the Kingdom", "Veyra touched the Frostcore, its light melting the ice, spring returning."],
      ["Soren’s Redemption", "Soren joined Veyra, his songs now warming hearts, his heart healed."],
      ["The Bear’s Gift", "The ice-bear gave Veyra a frost-string, enhancing her harp’s magic."],
      ["A New Kingdom", "A kingdom signaled Veyra, its rivers frozen, needing her melodies."],
      ["The Strings’ Light", "Veyra’s harp glowed, its notes alive with the kingdom’s thanks."],
      ["Soren’s Role", "Soren became Veyra’s partner, his songs aiding the thaw."],
      ["The Frostcore’s Song", "The Frostcore sang, guiding Veyra to new frosts."],
      ["The Kingdom’s Hope", "Veyra’s melody thawed the kingdom, its rivers flowing."],
      ["A Funny Incident", "Veyra’s string summoned a hopping ice-rabbit, amusing villagers."],
      ["The Bear’s Trust", "The bear named Veyra the Frostsong, her harp legendary."],
      ["Soren’s Peace", "Soren found peace, his songs weaving hope."],
      ["The Kingdom’s Gift", "The kingdom gifted Veyra a frost-locket, its glow echoing thanks."],
      ["The Frostcore’s Vision", "The Frostcore showed visions of frozen lands needing Veyra."],
      ["The Strings’ Song", "The harp sang, soothing Veyra as she played."],
      ["A Twist of Fate", "Veyra found a note showing her as the Frostcore’s keeper, destined to thaw."],
      ["The Kingdom’s Future", "The kingdom thrived, its people now harpers under Veyra."],
      ["The Bear’s Legacy", "The bear gifted a star-string, enhancing her precision."],
      ["A New Frost", "A frost signaled Veyra, its ice spreading."],
      ["The Frostcore’s Oath", "Veyra swore to thaw all kingdoms, her heart tied to the Frostcore."],
      ["The Peak’s Song", "The peak sang, a tribute to Veyra’s courage."],
      ["Soren’s Gift", "Soren crafted a frost-note for Veyra, its light glowing."],
      ["The Kingdom’s Heart", "The kingdom’s gratitude grew, its rivers vibrant."],
      ["The Frostcore’s Peace", "The Frostcore restored peace, its light eternal."],
      ["A New Thaw", "A distant thaw signaled Veyra, its ice needing her touch."],
      ["The Strings’ Future", "The harp glowed, ready for new melodies."],
      ["A Child’s Dream", "A child dreamed of playing with Veyra, her strings glowing."],
      ["The Bear’s Future", "The bear shone brighter, guiding Veyra."],
      ["A Funny Incident", "Veyra’s string summoned a dancing snow-crab, amusing the kingdom."],
      ["The Frostcore’s Legacy", "The Frostcore guided Veyra, its light eternal."],
      ["The Final Scene", "Veyra stood with her harp, Frostcore glowing, ready to play the next thawing melody."]
    ]
  },
  {
    title: "The Dawnweave Storyteller",
    desc: "A storyteller weaves tales that summon dawn to a shadowed world.",
    color: "from-yellow-400 to-amber-600",
    totalPages: 50,
    pages: [
      ["The Starlit Hearth", "Storyteller Mira wove tales that summoned dawn, lighting a world cloaked in shadows."],
      ["The Endless Night", "The world darkened, its dawn stolen, cursed by a shadow wraith’s veil."],
      ["The First Tale", "Mira’s story sparked a dawn-glow, revealing a Dawncore, a gem to restore light."],
      ["The Wraith’s Gloom", "Wraith Umber sought the Dawncore to deepen night, her shadows chasing Mira’s words."],
      ["A Bold Story", "Mira’s tale pierced Umber’s gloom, her heart steady under the wraith’s gaze."],
      ["The Hearth’s Vision", "The hearth showed a sun-mesa where the Dawncore hid, guiding Mira’s tales."],
      ["A Rival Storyteller", "Voren, a rival, stole Mira’s dawn-scroll, aiming to claim the Dawncore for Umber."],
      ["A Clever Tale", "Mira wove a decoy story, misleading Voren, her hearth’s vision leading to safety."],
      ["A Funny Mishap", "Mira’s tale summoned a dancing sun-sparrow, amusing villagers with its chirps."],
      ["The Mesa’s Guardian", "A dawn-fox guarded the Dawncore, demanding Mira tell a story of hope."],
      ["A Test of Light", "Mira told her village’s sunrise, her light earning the fox’s trust."],
      ["The Second Tale", "The fox gifted a star-word, its glow revealing the Dawncore’s lair."],
      ["Umber’s Trap", "Umber’s shadows trapped Mira, but her star-word wove a path."],
      ["The Lair’s Shine", "The lair glowed with dawn, guiding Mira to the Dawncore."],
      ["Voren’s Betrayal", "Voren, now Umber’s ally, told a shadow-tale, twisting Mira’s stories."],
      ["A Twist Revealed", "Voren was Mira’s brother, lost to Umber’s lies, seeking to outtell her."],
      ["The Dawncore’s Call", "The Dawncore pulsed, urging Mira to face Voren with stories, not rivalry."],
      ["A Story of Bonds", "Mira wove their shared childhood, softening Voren’s heart, breaking Umber’s hold."],
      ["Umber’s Fury", "Umber’s gloom surged, threatening to shroud the Dawncore and darken the world."],
      ["The Climax", "In the lair, Mira and Voren told together, their tales channeling the Dawncore to banish Umber."],
      ["Restoring Dawn", "Mira touched the Dawncore, its light summoning dawn, the world bright again."],
      ["Voren’s Redemption", "Voren joined Mira, his stories now lighting hearts, his heart healed."],
      ["The Fox’s Gift", "The dawn-fox gave Mira a sun-scroll, enhancing her tales’ magic."],
      ["A New World", "A world signaled Mira, its light fading, needing her stories."],
      ["The Hearth’s Light", "Mira’s hearth glowed, its words alive with the world’s thanks."],
      ["Voren’s Role", "Voren became Mira’s partner, his tales aiding dawn’s spread."],
      ["The Dawncore’s Song", "The Dawncore sang, guiding Mira to new shadows."],
      ["The World’s Hope", "Mira’s story restored the world, its dawn vibrant."],
      ["A Funny Incident", "Mira’s tale summoned a hopping sun-frog, amusing villagers."],
      ["The Fox’s Trust", "The fox named Mira the Dawnweave, her tales legendary."],
      ["Voren’s Peace", "Voren found peace, his stories weaving hope."],
      ["The World’s Gift", "The world gifted Mira a sun-locket, its glow echoing thanks."],
      ["The Dawncore’s Vision", "The Dawncore showed visions of shadowed worlds needing Mira."],
      ["The Hearth’s Song", "The hearth sang, soothing Mira as she wove."],
      ["A Twist of Fate", "Mira found a word showing her as the Dawncore’s keeper, destined to tell."],
      ["The World’s Future", "The world thrived, its people now storytellers under Mira."],
      ["The Fox’s Legacy", "The fox gifted a star-tale, enhancing her precision."],
      ["A New Shadow", "A shadow signaled Mira, its darkness spreading."],
      ["The Dawncore’s Oath", "Mira swore to weave all dawns, her heart tied to the Dawncore."],
      ["The Mesa’s Song", "The mesa sang, a tribute to Mira’s courage."],
      ["Voren’s Gift", "Voren wove a sun-story for Mira, its light glowing."],
      ["The World’s Heart", "The world’s gratitude grew, its dawn vibrant."],
      ["The Dawncore’s Peace", "The Dawncore restored peace, its light eternal."],
      ["A New Dawn", "A distant dawn signaled Mira, its light needing her touch."],
      ["The Hearth’s Future", "The hearth glowed, ready for new tales."],
      ["A Child’s Dream", "A child dreamed of telling with Mira, her words glowing."],
      ["The Fox’s Future", "The fox shone brighter, guiding Mira."],
      ["A Funny Incident", "Mira’s tale summoned a dancing dawn-crab, amusing the world."],
      ["The Dawncore’s Legacy", "The Dawncore guided Mira, its light eternal."],
      ["The Final Scene", "Mira stood at her hearth, Dawncore glowing, ready to weave the next dawn-tale."]
    ]
  },

]

export default function EnhancedSleepStories({ onBack }: EnhancedSleepStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isReading, setIsReading] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  
  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          setVoicesLoaded(true)
        }
      }
      
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Enhanced TTS functionality
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()
        
        // Wait a bit for cancel to complete
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text)
          
          // Enhanced text processing for better narration
          const processedText = text
            .replace(/\./g, '... ')
            .replace(/,/g, ', ')
            .replace(/!/g, '! ')
            .replace(/\?/g, '? ')
            .replace(/:/g, ': ')
            .replace(/;/g, '; ')
            .replace(/—/g, ' — ')
            .replace(/–/g, ' – ')
          
          utterance.text = processedText
          utterance.lang = 'en-US'
          utterance.rate = 0.7
          utterance.pitch = 0.9
          utterance.volume = 0.8
          
          // Try to use a more natural voice
          const voices = window.speechSynthesis.getVoices()
          const preferredVoice = voices.find(voice => 
            voice.lang.includes('en') && 
            (voice.name.includes('Natural') || voice.name.includes('Enhanced') || voice.name.includes('Premium'))
          ) || voices.find(voice => voice.lang.includes('en')) || voices[0]
          
          if (preferredVoice) {
            utterance.voice = preferredVoice
          }
          
          utterance.onstart = () => {
            console.log('TTS started')
            setIsReading(true)
          }
          
          utterance.onend = () => {
            console.log('TTS ended')
            setIsReading(false)
          }
          
          utterance.onerror = (event) => {
            console.error('TTS Error:', event)
            setIsReading(false)
          }
          
          utterance.onpause = () => {
            console.log('TTS paused')
          }
          
          utterance.onresume = () => {
            console.log('TTS resumed')
          }
          
          // Speak the text
          window.speechSynthesis.speak(utterance)
        }, 100)
      } catch (error) {
        console.error('TTS Error:', error)
        setIsReading(false)
      }
    } else {
      console.warn('Speech synthesis not supported')
      alert('Text-to-speech is not supported in your browser')
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        // Force stop after a short delay
        setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel()
          }
          setIsReading(false)
        }, 100)
      } catch (error) {
        console.error('Error stopping TTS:', error)
        setIsReading(false)
      }
    }
  }

  const getPageColor = (pageNum: number) => {
    const colors = [
      'from-purple-100 to-pink-100',
      'from-blue-100 to-cyan-100',
      'from-green-100 to-emerald-100',
      'from-yellow-100 to-orange-100',
      'from-red-100 to-rose-100',
      'from-indigo-100 to-purple-100',
      'from-teal-100 to-green-100',
      'from-orange-100 to-red-100'
    ]
    return colors[(pageNum - 1) % colors.length]
  }

  if (selectedStory !== null) {
    const story = stories[selectedStory]
    if (!story) return <div>Story not found</div>
    
    const currentPageContent = story.pages[currentPage - 1] || []
    const pageText = currentPageContent.join(' ')

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedStory(null)
              setCurrentPage(1)
              stopSpeaking()
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              setSelectedStory(null)
              setCurrentPage(1)
              stopSpeaking()
            }}
            size="lg"
            className="touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{story.title}</h3>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {story.totalPages}
          </div>
        </div>

        {/* Story Reader with Page Transition Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Card className={`relative min-h-[600px] bg-gradient-to-br ${getPageColor(currentPage)} border-2 shadow-xl`}>
              <div className="absolute inset-0 p-8 flex flex-col">
                {/* Page Header with Book Animation */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className={`inline-block px-8 py-4 rounded-full bg-gradient-to-r ${story.color} text-white shadow-lg`}>
                    <h2 className="text-2xl font-bold">{currentPageContent[0]}</h2>
                  </div>
                </motion.div>

                {/* Story Content with Fade-In */}
                <motion.div
                  className="flex-1 flex items-center justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="prose prose-lg max-w-none text-center space-y-4">
                    <p className="text-gray-700 leading-relaxed text-lg font-medium transition-all duration-300 hover:scale-105 hover:text-gray-900">
                      {currentPageContent[1]}
                    </p>
                  </div>
                </motion.div>

                {/* Page Number with Slide-In */}
                <motion.div
                  className="text-center text-gray-500 text-sm"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {currentPage} / {story.totalPages}
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            <Button 
              onClick={() => isReading ? stopSpeaking() : speakText(pageText)}
              onTouchEnd={(e) => { e.preventDefault(); isReading ? stopSpeaking() : speakText(pageText) }}
              variant={isReading ? "destructive" : "default"}
              size="lg"
              className="touch-manipulation"
            >
              {isReading ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isReading ? 'Stop Reading' : 'Read Aloud'}
            </Button>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(Math.min(story.totalPages, currentPage + 1))}
            disabled={currentPage === story.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            onTouchEnd={(e) => { e.preventDefault(); onBack() }}
            size="lg"
            className="touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Self-Care
          </Button>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">📚 Enhanced Sleep Stories</h3>
        </div>

      <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h4 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-200">Immersive Sleep Stories</h4>
          <p className="text-purple-700 dark:text-purple-300">
            Journey into peaceful worlds with our collection of calming bedtime stories. Each tale is crafted to help you relax and drift into restful sleep.
          </p>
        </motion.div>
      </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {stories.map((story, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div 
                className={`h-48 bg-gradient-to-br ${story.color} rounded-t-lg relative overflow-hidden`}
                onClick={() => {
                  setSelectedStory(index)
                  setCurrentPage(1)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  setSelectedStory(index)
                  setCurrentPage(1)
                }}
                style={{ touchAction: 'manipulation' }}
              >
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                  <div className="text-center text-white">
                    <BookOpen className="w-12 h-12 mx-auto mb-2" />
                    <h4 className="text-lg font-bold">{story.title}</h4>
                  </div>
                </motion.div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{story.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{story.totalPages} pages</span>
                  <Button 
                    size="lg" 
                    onClick={() => {
                      setSelectedStory(index)
                      setCurrentPage(1)
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      setSelectedStory(index)
                      setCurrentPage(1)
                    }}
                    className="touch-manipulation"
                  >
                    Read Story
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
          ))}
        </div>

        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h4 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">🌙 Sleep Story Benefits</h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              <strong>Better Sleep Quality:</strong> Guided relaxation • Stress reduction • Mind calming • Improved sleep onset • Enhanced dream quality • Anxiety relief
            </p>
          </motion.div>
        </Card>

        {/* Custom Animations */}
        <style>{`
          @keyframes bookOpen {
            0% { transform: perspective(1000px) rotateY(0deg); }
            100% { transform: perspective(1000px) rotateY(10deg); }
          }
          .animate-bookOpen {
            animation: bookOpen 2s ease-in-out infinite alternate;
          }
        `}</style>
      </div>
    </div>
  )
}