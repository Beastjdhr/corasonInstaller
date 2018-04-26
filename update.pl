use warnings;
use strict;

print "ARGV[0] is $ARGV[0]";

if ($ARGV[0] =~ m/evodivmet/) {
	print "evodevo";
	open UD, '>>userData.txt' or die $!;
	print UD "CORASON_installed= true\n";
	close UD;
}
