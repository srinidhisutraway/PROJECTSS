
//important logic ;Pyramid at center

public class Loop9 {
    public static void main(String[] args) {
        for(int i=0;i<5;i++){//total number of rows
                            // System.out.print(" ");

        // System.out.println("**");
        for(int j=0;j<5-i;j++){//try understanding logic of space here
                System.out.print(" ");
              }

              for(int j=0;j<2*i-1;j++){//another loop for understanding the * printinglogic ..get the formula by understanding the pattern
                System.out.print("*");
              }
              System.out.println();
        }
        for(int i=5;i>0;i--){//total number of rows
                            // System.out.print(" ");

        // System.out.println("**");
        for(int j=0;j<5-i;j++){//try understanding logic of space here
                System.out.print(" ");
              }

              for(int j=0;j<2*i-1;j++){//another loop for understanding the * printinglogic ..get the formula by understanding the pattern
                System.out.print("*");
              }
              System.out.println();
        }
        
    }
     
        
    }
    



