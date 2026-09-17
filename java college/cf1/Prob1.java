import java.util.Scanner;
public class Prob1 {
    public static void main(String[] args){
        Scanner s = new Scanner(System.in);//keybord input
        int x;
        int y;
        System.out.println("enter the coordinates");
        x=s.nextInt();
        y=s.nextInt();

        if(x==0 && y==0){
            System.out.println("origin");

        }
        else if(x==0){
                        System.out.println("y-axis");


        }
         else if(y==0){
                        System.out.println("x-axis");


        }
         else if(x>0 && y>0){
                        System.out.println("1st quadrant");


        }
        else if(x<0 && y>0){
                        System.out.println("2st quadrant");


        }
         else if(x<0 && y<0){
                        System.out.println("3st quadrant");


        }
         else if(x>0 && y<0){
                        System.out.println("4st quadrant");


        }
    }
    
}
