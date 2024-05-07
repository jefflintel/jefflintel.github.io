const root = "~";
let cwd = root;

const user = "guest";
const server = "jefflintel.github.io";

const prompt = () => {
  return `<green>${user}@${server}<green>:<blue>${cwd}</blue>`;
};

const print_dirs = () => {
  term.echo(
    dirs
      .map((dir) => {
        return `<blue class="directory">${dir}</blue>`;
      })
      .join("\n")
  );
};

const commands = {
  help() {
    term.echo(`List of available commands: ${help}`);
  },
  echo(...args) {
    if (args.length > 0) {
      term.echo(args.join(" "));
    }
  },
  cd(dir = null) {
    if (dir === null || (dir === ".." && cwd !== root)) {
      cwd = root;
    } else if (dir.startsWith("~/") && dirs.includes(dir.substring(2))) {
      cwd = dir;
    } else if (dirs.includes(dir)) {
      cwd = root + "/" + dir;
    } else {
      this.error("Wrong directory");
    }
  },
  ls(dir = null) {
    if (dir) {
      if (dir.startsWith("~/")) {
        const path = dir.substring(2);
        const dirs = path.split("/");
        if (dirs.length > 1) {
          this.error("Invalid directory");
        } else {
          const dir = dirs[0];
          this.echo(directories[dir].join("\n"));
        }
      } else if (cwd === root) {
        if (dir in directories) {
          this.echo(directories[dir].join("\n"));
        } else {
          this.error("Invalid directory");
        }
      } else if (dir === "..") {
        print_dirs();
      } else {
        this.error("Invalid directory");
      }
    } else if (cwd === root) {
      print_dirs();
    } else {
      const dir = cwd.substring(2);
      this.echo(directories[dir].join("\n"));
    }
  },
  portrait() {
    term.echo(headshot);
  },
  email() {
    term.echo(
      "<yellow>Contact me at</yellow> <green><a href='mailto:jefflintel@gmail.com'>jefflintel@gmail.com</a></green>"
    );
  },
  linkedin() {
    term.echo(
      "<blue><a href='https://www.linkedin.com/in/jeffrey-lintel/'>Jeff Lintel on LinkedIn</a></blue>"
    );
  },
};

const font = "Poison";

const ready = () => {
  const seed = rand(256);
  term
    .echo(() => rainbow(render("Lintel Terminal Portfolio"), seed))
    .echo("<green>Explore my portfolio using the CLI</green>")
    .echo("<aqua>Type help for a list of available commands\n</aqua>")
    .resume();
};

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts" });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const term = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false,
  completion: true,
  prompt,
});

term.pause();

const render = (text) => {
  const cols = term.cols();
  return figlet.textSync(text, {
    font: font,
    width: cols,
    whitespaceBreak: true,
  });
};

//remove whitespace after ascii title
const trim = (str) => {
  return str.replace(/[\n\s]+$/, "");
};

//render text in rainbow
const rainbow = (str) => {
  return lolcat
    .rainbow((char, color) => {
      char = $.terminal.escape_brackets(char);
      return `[[;${hex(color)};]${char}]`;
    }, str)
    .join("\n");
};

const hex = (color) => {
  return (
    "#" +
    [color.red, color.green, color.blue]
      .map((n) => {
        return n.toString(16).padStart(2, "0");
      })
      .join("")
  );
};

//prevent color changes on window resize
const rand = (max) => {
  return Math.floor(Math.random() * (max + 1));
};

const command_list = ["clear"].concat(Object.keys(commands));
const formatted_list = command_list.map((cmd) => {
  return `<white class="command">${cmd}</white>`;
});
const help = formatter.format(command_list);

// term.on("click", ".command",  function() {
//   const command = $(this).text();
//   term.exec(command);
// });

const any_command_re = new RegExp(`^\s*(${command_list.join("|")})`);

const re = new RegExp(`^\s*(${command_list.join("|")})(\s?.*)`);

$.terminal.new_formatter([
  re,
  function (_, command, args) {
    return `<white class="command">${command}</white><aqua>${args}</aqua>`;
  },
]);

const directories = {
  education: [
    "",
    "<purple>Education</purple>",
    "~*~ <purple><a href='https://www.bellevue.edu/degrees/bachelor/web-development-bs/' target='_blank'> Bellevue University</a></purple><gold>Web Development</gold>",
    "~*~ <purple><a href='https://www2.mccneb.edu/' target='_blank'> Metropolitan Community College - Omaha, NE</a></purple><gold>Programming for Database and Web</gold>",
    "~*~ <purple><a href='https://aiminstitute.org/' target='_blank'> AIM Institute</a></purple><gold>.NET Development Bootcamp</gold>",
    "~*~ <purple><a href='https://aiminstitute.org/' target='_blank'> AIM Institute</a></purple><gold><purple><gold>Foundations of Web Development</gold>",
  ],
  projects: [
    "",
    "<purple>Projects</purple",
    [
      [
        "Reactivities",
        "https://github.com/jefflintel/net-react-typescript",
        "A social event planning app using .NET 8, SQL, and React + TypeScript <yellow>In progress</yellow>",
      ],
      [
        "Node Blog",
        "https://github.com/jefflintel/node-posts",
        "Blog built using the MERN stack featuring GraphQL",
      ],
      [
        "Reactstagram",
        "https://github.com/jefflintel/mern",
        "MERN Instagram clone including Google Maps APIs",
      ],
      [
        "React Restaurant",
        "https://github.com/jefflintel/react-apps",
        "React online restaurant utilizing a Firebase backend",
      ],
      [
        "More",
        "https://github.com/jefflintel?page=1&tab=repositories",
        "All of my completed projects",
      ],
    ].map(([name, url, description = ""]) => {
      return `~*~ <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
    "",
  ].flat(),
  skills: [
    "",
    "<white>languages</white>",
    ["JavaScript", "TypeScript", "C#", "SQL"].map(
      (lang) => `~*~ <purple>${lang}</purple>`
    ),
    "",
    "<white>libraries</white>",
    ["React (+ TypeScript)", "MobX", "Redux", "Angular"].map(
      (lib) => `~*~ <green>${lib}</green>`
    ),
    "",
    "<white>tools</white>",
    ["git", "vscode", "postman", "figma"].map(
      (tool) => `~*~ <blue>${tool}</blue>`
    ),
  ].flat(),
};

const dirs = Object.keys(directories);

const headshot = `                                                                                                    
                                                                                                    
                                                                                                    
                                       .. ..   . ....                                               
                                   .....................                                            
                             .................................                                      
                          ............................     ....                                     
                          .......     .........',''...      .......                                 
                       .......        ..........'''''...      ......                                
                     ........      .....'',,;:::clllllc;,..............                             
                   ..........   ..';:cclodxxkkkkkkkkxxdol:,..............                           
                ............   .;ldxkOO0KKKKK000OOkkxxdddoc;'....  ..........                       
            ...............  .,cdxkO000KKXXXXKK000OOkkxxxdoo:..     .........                       
          ................. .,odxkO00KKKXXXXXXKKK000OOkkxdool;..    .........                       
      .......................:oxkOO000KXXXXXXXXKKK0000OOkdooc;'.    .........                       
     ........................;oxOO000KKKKKXXKKKKK00000OOkxdoc;'..    ........                       
     ........................;oxkO00KKKKXXXXXXXXXKK000OOkxool:,..    ........                       
     ........................;okOO000KXXXXXXXXKKOOkkkkkkkxolll;...    ........                      
     ...................... .:oxxkkkxxkO00KKK0Okdoooodxkkkxdool;....';,.........                    
     ........................cdxxdol::clok0K0kdoloolc:clodxxddoc'..;coo:...........                 
     .....................:;,lxxdllllllodk0K0kddxkkOOOOkkkkkkdol;',ldodl...........                 
     .....................ll:okOOOOOOOOOOO00OkkkOO00K0K000OOkdlc;,:oxdd;...........                 
     .....................cdcokO00KKK0OOO0KK0kkkkkkO0KXXK0OOxdlc,,:lodc............                 
     .....................'cclkO0KKK0OkkkO0KOkxddddk000KKK0Oxdl:,':ooc'............                 
     ......................',cxk000OOOxl:codo:;,;cloddddkO0Okxl;'.:oc'..........                    
     ........................;oxOOxdddlc::coolclooolcc::lxOOxdc,..';'.............                  
     ........................,cdxdc::::oxxOOOOkkkxdl::c:coddol;'..................                  
     .........................;cll::cc:lxk00000OOkxxxkxl:::::;'................. .                  
     ..........................,:::;lxkkkO0000OOkkxxkxdc;,;;,...................                    
     ..........................',,,,;oxdddoolollodxxdoc;,''....   ...............                   
     .............................'',:coooolloooooooc:,,''.. ...   .............                    
     ................................';:clooooolc:;;,'''....   .....................                
         ............................''.',;;:;;,''.........   ......................                
         .......................'..........'''............ .....',,.................                
         .................................................  ...';ccc:;'.............                
          ...................................................',:coddddolc,. .........               
            ...................'......................''...';;;lddxkddddddc,........                
            ...............,;;,,'.....................'''',;:cldxxxddxxxxxxxoc,...                  
            .... ......,:lddoc;,,'''................'''',,;:coodxxddxkkkkkkkkOkdc;..                
            ... ...':odkOOOkdl:;,,,''...............'',;;;:ccldxdooxxkkkOOkOOOOOOkdl;'.             
             ...;cdxOOOOOOOkxolc::;,,''............'',;::cccldddoodkkOOOOOOOOOOOOOkkxdc;'.          
          ..':oxkOOOO00OOOOOkxolc::;;,,'''',,''''''',;;::cloddlldxxkOOOOkkkOOOOOOOOOkkxxoc;'.       
        .':oxkOOO00OOOOOOOOOOkdollcc:;;;;;;;;;;,,,,,,;:cllddolldxxkkkOOOOOOO0000000OOOOkxdolc,.     
       .cxkkOOOO0000000OOOOOOkdolooc;,:::;:c:::;;;,;::cloddolldxkkOOOO00000000000KK0000OOkxoool;.   
      'lxkkOO0O0000000OOOOOOOkxolol:;;:llc:::cccc:;;,:coddolloxkO00000000000K0000KK00000Okkxxxdoc,. 
     ,oxkkOOOOOOO0000OO0000000kdllcccccclloddoodl:;;;;:loooodxkOO00000000000K000000000OOOOOkkxxdol:.
    .okxkOOOOOOOOOO00OO000000OOxolllllcc:okkxdllcccc:::clodxxkkOO00KK0000000KKKKK0000OkkOOOkkkxdooc;
   .ckkxkOOOOOOOOOOOOOOO000OOOOkxdooollc:ldoolllllllcclodxxkkkOOOO000000000000000000OkxkOOkxxkxddoc:
  .;oxkxxkOOOOOOOOOOOOOO00OOOkkxxddxddolccllllloolllooodxxkkkOO0000000000000000K000OxxkO0OxxkOxdool:
  'ldxxxdxkOOOOkkOOOOOOOOOOOOOOkkkxxxxdolloooodddolooddxxxkOOOOOOOOO00000000000000OxdkOOkxxOOxoooolc
 .:oddxxxxkkkkOkOOOOOOOOOOOOOOOkkOkkkxxxddddddxxdddxxxxxkkkOOOOO0000KK00000000000OddxOOxdxOOxllooolc
 ,loddxxxkkkkkkkkOOOOOOOOOOOOOOOOOkkkkkkxxxxxxxxxxxxxkkkkOOOOOOOO000000000000000kdodkkdoxkkxoldddolc
.cloloxddxxxkkkkkOOOOOOOOOOOOOOOOkkkkkkkkkkkkkkkkkkkkkkkOOOOOOOO00000000000K000kolokkoldkkdlldxddolc
;lllcoxdodxxxkkkkkkkkkkkkkkkkOOOOOkkkkOOkkkkkkkkkkkkkOOOOOOOOO0000000000K0000Oxocoxkoldkkdlldxxdolc:
ccclccodooddxxkkkxxxxxkkkkkkOOOOOkkkkkkkkkkOOkkkkkkkkkOOOOOOOOO000000000000O0klloxkocokxoloxxxdolccc
c::cc::ccloddxxkxxxxkkkxxxxkkOOkkkkkkkkkkkkkkkkkkkkkkOOOOOOOOOOOOO000OOOOOOOkocoxko:lxdlldxxxdolllcc
cc::::;;;;;:ldxxdddxxxxxxxxxkkkkkkkkkkkkkkkkkkkOOOOkkkkkOOOOOOOOOOOOOOOkkOOkdclxko:coocldxxkxdolllc:
cc::;;;;;,''cddooodxxxxxxkkxkkkkOkkkkkkkkkkkkkkkkkkkkkkkOkkkOOOOOOOOOOOkkkkxlcodoccolcoxxxxxollclc::
cc:::;;,;;,':lllloddxdxxxkkkkkkkkxxkkkkkkkkkkkkkkOOOOOkkkOkOOOOOOOOOOkkkkxddc,;lllllodxkkxdoc:cllc:;
clc:::::;,;,:cccllodddxxxkkkkkkkxxxxkkkkkkkkxkkkkkkkkkkkkkOOkkkkkOOOOkkkkxxd:.,llcloxxxxdl:::looc;;;
:llccccc::;,;::cloododddxxxxxxxxxddxxxxxxxxxxxkkOOOOkkkkkkkkkkkkkkkkkxxxxxxo;,coldxxxxxoc;;coooc;;:,
;cllcccc::;',::cllloodddxxdddddxxddxxxxxxxxxdxkkkkkkOkkkkkOOOkkkkkkkkxxxxxdc,;lodxddddo:;:lool:;;:c'
`;

const email = "jefflintel@gmail.com";
