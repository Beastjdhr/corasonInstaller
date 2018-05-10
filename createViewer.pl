use warnings;
use strict;


my $dir= $ARGV[0];

    open VIEWER, ">>$dir.html" or die $!;
    print VIEWER "<html>
    <head>

    </head>
    <body>
        <object data=\"$dir/$dir.svg\" type=\"image/svg+xml\">
        </object>
    </body>
</html>";
close VIEWER;
my $OS= `uname -a`;
if ($OS=~ /Linux/) {
`firefox $dir.html`;
}
elsif ($OS=~ /Darwin/) {
    `open -a Safari $dir.html`;
}
